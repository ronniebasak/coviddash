<template>
    <div class="card-main">
        <div class="card-title" :style="{color: titleColor}">{{title}}</div>
        <div class="card-body">
            <slot>
                NO DATA
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: [
        "title", "titleColor"
    ],
    data: () => {return {
    }}
}
</script>

<style lang="scss" scoped>
    .card-main {
        width: calc(100% - 30px);
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgb(107, 141, 214);
        font-family: 'poppins';

        .card-title {
            text-align: left;
            font-size: larger;
            font-weight: bold;
        }

        .card-body {
            text-align: left;
        }
    }
</style>