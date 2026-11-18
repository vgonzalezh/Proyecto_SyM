<script setup>
import { onMounted, ref } from 'vue'
defineProps({ titulo: String, mensaje: String, textoConfirmar: { type: String, default: 'Aceptar' } })
const emit = defineEmits(['confirmar', 'cancelar'])
const cancelar = ref(null)
onMounted(() => cancelar.value.focus())
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancelar')" @keydown.esc="emit('cancelar')">
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <h2 id="modal-titulo">{{ titulo }}</h2>
      <p>{{ mensaje }}</p>
      <div class="modal-actions">
        <button ref="cancelar" class="btn btn--ghost" type="button" @click="emit('cancelar')">Cancelar</button>
        <button class="btn" type="button" @click="emit('confirmar')">{{ textoConfirmar }}</button>
      </div>
    </div>
  </div>
</template>
