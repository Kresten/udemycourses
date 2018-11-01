<template>
<!-- __xl__ is the amount of padding between the posts. Could also be md, sm or xs -->
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img @click.native="goToPost(post._id)" :src="post.imageUrl" height="30vh" lazy></v-img>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="showPostCreator = !showPostCreator" icon>
              <!-- Neat little interpolation to toggle icon -->
              <v-icon>{{`keyboard_arrow_${showPostCreator ? 'up' : 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin">Added {{formatCreatedDate(post.createdDate)}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>

              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>

        </v-card>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
import moment from 'moment';
import { INFINITE_SCROLL_POSTS } from '../../queries';
import { setInterval } from 'timers';

const pageSize = 3;

export default {
  name: 'Posts',
  data() {
    return {
      pageNum: 1,
      showPostCreator: false,
      atBottom: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      },
      // result is called when a result is received
      result() {
        this.isBottomVisible();
      }
    }
  },
  methods: {
    isBottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      this.atBottom = bottomOfPage || pageHeight < visible;
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format('ll');
    },
    showMorePosts() {
      this.pageNum += 1;
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    showMoreEnabled() {
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore;
    },
    /**
     * this should be in an util library/service/file
     * use inDebounce to maintain internal reference of timeout to clear
     * debounce queues a function, which it fires after the delay.
     * If invoked again before the function was fired, then the function if postponed until the delay is over
     */
    debounce(func, delay) {
      let inDebounce;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
      };
    },
    /**
     * Throttle fires the function, queues one if invoked, which it fires after a delay, and so on
     */

    throttle(func, limit) {
      let lastFunc;
      let lastRan;
      return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function() {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    }
  },
  created() {
    window.addEventListener('scroll', this.throttle(this.isBottomVisible, 200));
  },
  destroyed() {
    window.removeEventListener(
      'scroll',
      this.throttle(this.isBottomVisible, 200)
    );
  },
  watch: {
    atBottom(value) {
      if (value && this.showMoreEnabled()) {
        this.showMorePosts();
      }
    }
  }
};
</script>
