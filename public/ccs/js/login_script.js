// Asegura que se cargue el contenido HTML antes de ejecutar el codigo
document.addEventListener('DOMContentLoaded', () => {

  const btnEntrar = document.getElementById('btnEntrar');

  btnEntrar.addEventListener('click', async () => {

    // Obtenemos los datos del usuario
    const username = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validacion basica
    if (!username || !password) {
      alert('Por favor ingrese usuario y contraseña');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, contrasena: password })
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Guardar el usuario logueado en sessionStorage
        sessionStorage.setItem('empleado', JSON.stringify(data.empleado));
        // Redirigir a la página principal
        window.location.href = '/public/ccs/index.html';
      } else {
        alert(data.mensaje || 'Credenciales inválidas.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor');
    }

  });

});