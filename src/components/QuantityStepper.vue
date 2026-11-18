<script setup>
// Componente con v-model (enlace bidireccional): el padre y el hijo comparten el valor.
const cantidad = defineModel({ type: Number, default: 1 })
const props = defineProps({ min: { type: Number, default: 1 }, max: { type: Number, default: 10 } })
function cambiar(delta) {
  cantidad.value = Math.max(props.min, Math.min(props.max, Number(cantidad.value || props.min) + delta))
}
</script>

<template>
  <div class="qty-s">
    <button type="button" :disabled="cantidad <= min" aria-label="Quitar una unidad" @click="cambiar(-1)">−</button>
    <output aria-live="polite">{{ cantidad }}</output>
    <button type="button" :disabled="cantidad >= max" aria-label="Agregar una unidad" @click="cambiar(1)">+</button>
  </div>
</template>
