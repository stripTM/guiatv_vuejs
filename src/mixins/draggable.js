export const draggable = {
    data() {
        return {
            scrollX: 0,
            scrollY: 0,
            mouseDown: false,
            mouseMove: false,
            dragStartX: 0,
            dragStartY: 0
        }
    },
    watch: {
        // El scroll de la parrilla no es algo que está presente en el dom, con lo que hay que mantener manualmente el binding
        scrollX(newScroll) {
            this.$refs.drag.scrollLeft = newScroll
        },
        scrollY(newScroll) {
            this.$refs.drag.scrollTop = newScroll
        }
    },
    mounted() {
        if ('ontouchstart' in window) {
            this.$refs.drag.addEventListener('touchstart', this.handleMouseDown)
            this.$refs.drag.addEventListener('touchend', this.handleMouseUp)
            this.$refs.drag.addEventListener('touchmove', this.handleMouseMove)
        } else {
            this.$refs.drag.addEventListener('mousedown', this.handleMouseDown)
            this.$refs.drag.addEventListener('mouseup', this.handleMouseUp)
            this.$refs.drag.addEventListener('mousemove', this.handleMouseMove)
        }
    },
    destroyed() {
        if (this.$refs.drag) {
            if ('ontouchstart' in window) {
                this.$refs.drag.removeEventListener('touchstart', this.handleMouseDown)
                this.$refs.drag.removeEventListener('touchend', this.handleMouseUp)
                this.$refs.drag.removeEventListener('touchmove', this.handleMouseMove)
            } else {
                this.$refs.drag.removeEventListener('mousedown', this.handleMouseDown)
                this.$refs.drag.removeEventListener('mouseup', this.handleMouseUp)
                this.$refs.drag.removeEventListener('mousemove', this.handleMouseMove)
            }
        }
    },
    methods: {
        handleMouseDown(e) {
            if (!e.touches) {
                e.preventDefault()
            }
            this.mouseDown = true
            this.mouseMove = false
            this.dragStartX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
            this.dragStartY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
        },
        handleScroll(e) {
            this.scrollX = e.target.scrollLeft
            this.scrollY = e.target.scrollTop
        },
        handleMouseMove(e) {
            if (this.mouseDown) {
                this.mouseMove = true
                let positionX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
                let positionY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
                let dragDistanceX = positionX - this.dragStartX
                let dragDistanceY = positionY - this.dragStartY

                this.scrollX -= dragDistanceX
                this.scrollY -= dragDistanceY
                this.dragStartX += dragDistanceX
                this.dragStartY += dragDistanceY
            }
        },
        handleMouseUp() {
            this.mouseDown = false
        }
    }
}
