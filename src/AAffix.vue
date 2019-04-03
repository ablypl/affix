<template>
  <div ref="wrapper">
    <div ref="breakpoint" />
    <div :style="wrapperStyles">
      <slot />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle';

const AFFIXED_EVENT_NAME = 'affixed';
const RELEASED_EVENT_NAME = 'released';
const MOBILE_BREAKPOINT = 756;

export default {
    name: "AAffix",
    props: {
        offset: {
            type: Number,
            default: 0
        },

        onAffix: {
            type: Function,
            default: () => {
            }
        },

        boundary: {
            type: [String, Node],
            default: null,
        },

        disableMobile: Boolean,
        mobileOnly: Boolean,
        bottom: Boolean,
    },

    data() {
        return {
            styles: {},
            fixed: false,
            top: 0,
        };
    },

    computed: {
        isEnabled() {
            const screenSize = window.innerWidth;
            // disable on mobile
            if(screenSize < MOBILE_BREAKPOINT && this.disableMobile) {
                return false;
            }
            // disable on desktop
            if(screenSize > MOBILE_BREAKPOINT && this.mobileOnly) {
                return false;
            }

            return true;
        },

        wrapperStyles() {
            const styles = {
                ...this.styles,
            };

            if (this.fixed) {
                styles.position = 'fixed';
            }

            return styles;
        },

        boundaryNode() {
            if (!this.boundary) {
                return;
            }

            return document.getElementById(this.boundary);
        },

        boundaryBottom() {
            if (!this.boundary) {
                return;
            }

            return this.boundaryNode.offsetHeight + this.boundaryNode.offsetTop;
        },

        height() {
            const { height } = this.$refs.wrapper.getBoundingClientRect();
            return height;
        }
    },

    watch: {
        fixed(fixed) {
            this.$emit(fixed ? AFFIXED_EVENT_NAME : RELEASED_EVENT_NAME);

            if (!fixed) {
                return;
            }

            this.onAffix();
        },

        top(value) {
            if (this.bottom) {
                return;
            }
            this.$set(this.styles, 'top', `${value}px`);
        },
    },

    mounted() {
        this.init();
    },

    beforeDestroy() {
        this.unbindEvents();
    },

    methods: {
        init() {
            if (!this.isEnabled) {
                return;
            }

            const { height, left, width } = this.$refs.wrapper.getBoundingClientRect();
            this.top = this.offset;

            this.styles = {
                height: `${height}px`,
                left: `${left}px`,
                width: `${width}px`,
                transition: 'all 0.3s ease',
            };

            if (!this.bottom) {
                this.$set(this.styles, 'top', `${this.top}px`);
            }

            if (this.bottom) {
                this.$set(this.styles, 'bottom', `${this.offset}px`);
                this.$refs.wrapper.style.height = `${height}px`;
                this.$refs.wrapper.style.width = `${width}px`;
            }

            this.bindEvents();
        },

        handleChange() {
            const { y, top } = this.fixed
                ? this.$refs.breakpoint.getBoundingClientRect()
                : this.$refs.wrapper.getBoundingClientRect();

            if (this.bottom) {
                return this.handleBottomAffix();
            }

            this.fixed = y - this.offset <= 0;

            if (this.boundary) {
                const { bottom } = this.boundaryNode.getBoundingClientRect();
                this.fixed = bottom >= 0 && top - this.offset <= 0;

                this.top = this.offset;

                if (bottom > 0 && (bottom <= this.height + this.offset)) {
                    this.top = bottom - this.height;
                }
            }
        },

        handleBottomAffix() {
            const { height, top } = this.$refs.wrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            this.fixed = top + height + this.offset >= windowHeight;

            if(this.boundary) {
                this.fixed = this.fixed && this.boundaryNode.getBoundingClientRect().top + height + this.offset <= windowHeight
            }
        },

        bindEvents() {
            window.addEventListener('scroll', throttle(this.handleChange, 20));
            window.addEventListener('resize', this.handleChange);
        },

        unbindEvents() {
            window.removeEventListener('scroll', this.handleChange);
            window.removeEventListener('resize', this.handleChange);
        },
    },
};
</script>

