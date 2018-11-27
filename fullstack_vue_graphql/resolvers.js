const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function createToken(user, secret, expiresIn) {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: 'favorites',
        model: 'Post'
      });
      return user;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: 'desc' })
        .populate({
          path: 'createdBy',
          model: 'User'
        });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser',
        model: 'User'
      });
      return post;
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // assign 'searchTerm' a text score to provide best match
          { score: { $meta: 'textScore' } }
          // sort on the text score, as well as likes
        ).sort({
          score: { $meta: 'textScore' },
          likes: 'desc'
        }).limit(5);

        return searchResults;
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).limit(pageSize);
      } else {
        // when we are not on first page, we skip the posts already grabbed
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).skip(skips).limit(pageSize);
      }
      totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    }
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    updateUserPost: async (_, { postId, userId, title, imageUrl, categories, description }, { Post }) => {
      const post = await Post.findOneAndUpdate(
        {
          //find post with id and that is created by that user
          _id: postId, createdBy: userId
        },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return post;
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId,
      }
      const post = await Post.findOneAndUpdate(
        // find the post by id
        { _id: postId },
        // push the message to the beginning of messages array - we move every message in order to the beginning, which reverses the array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }).populate({
          path: 'favorites',
          model: 'Post'
        }
        );
      return { likes: post.likes, favorites: user.favorites };
    },
    // does the opposite of above, inc with -1 and pull instead of addToSet
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }).populate({
          path: 'favorites',
          model: 'Post'
        }
        );
      return { likes: post.likes, favorites: user.favorites };
    },
    loginUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '7hr') };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '7hr') };
    }
  }
};
