<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <h2>登入</h2>
        <input type="text" placeholder="使用者名稱" />
        <button>登入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #333;
}

.login-container {
  width: 600px;
  height: 400px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(116deg, rgba(255, 255, 255, 0.20) 33.48%, rgba(153, 153, 153, 0.20) 96.52%);
  box-shadow: 0px 0px 8.7px 0px rgba(255, 255, 255, 0.50) inset;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form h2 {
  margin-bottom: 20px;
  color: white;
}

.login-form input {
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 200px;
}

.login-form button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #0056b3;
}
</style>