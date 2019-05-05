<template>
  <div class="form-group option-number">
    <label>
      <input type="number"
             :name="name"
             :min="min"
             :max="max"
             :step="step"
             :value="value"
             @input="input" />
      <slot />
    </label>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" scoped>
.option-number {
    input {
        position: relative;
        display: inline-block;
        min-height: 30px;
        line-height: 20px;
        border: 1px solid #70a5eb;
        border-radius: 5px;
        color: #000000;
        background: #fff;
        padding: 0 0 0 5px;
        width: 100px;
        transition: border 0.1s ease;
        box-sizing: border-box;
        margin-bottom: 8px;
        vertical-align: top;
    }

    label {
        span {
            @media (max-width: 800px) {
                display: block;
                font-size: 14px;
            }
        }
    }
}
</style>
