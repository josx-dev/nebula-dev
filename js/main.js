/* =========================================================
   NAVBAR
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");


/* =========================================================
   MENÚ HAMBURGUESA
========================================================= */

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {

      menuToggle.textContent = "✕";

    } else {

      menuToggle.textContent = "☰";

    }

  });

}


/* =========================================================
   CERRAR MENÚ AL TOCAR UN LINK
========================================================= */

links.forEach(function (link) {

  link.addEventListener("click", function () {

    if (navLinks) {
      navLinks.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.textContent = "☰";
    }

  });

});


/* =========================================================
   NAVBAR AL HACER SCROLL
========================================================= */

const header = document.querySelector(".header");


function actualizarHeader() {

  if (!header) {
    return;
  }

  if (window.scrollY > 80) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

}


window.addEventListener(
  "scroll",
  actualizarHeader,
  { passive: true }
);


/* Ejecutamos una vez por si cargamos
   la página estando scrolleada */

actualizarHeader();



/* =========================================================
   MATRIX FUTURISTA NEBULA
========================================================= */

const matrixCanvas =
  document.getElementById("matrix-canvas");


if (matrixCanvas) {

  const ctx =
    matrixCanvas.getContext("2d");


  /* =====================================================
     CARACTERES
  ===================================================== */

  const caracteres =
    "01<>[]{}/*+NEBULA#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  /* =====================================================
     PALETA NEBULA
  ===================================================== */

  const colores = [

    "#7c3aed",   // violeta principal

    "#8b5cf6",   // violeta claro

    "#a78bfa",   // lila

    "#6366f1",   // índigo

    "#3b82f6",   // azul

    "#c4b5fd"    // lila muy claro

  ];


  /* =====================================================
     VARIABLES
  ===================================================== */

  let columnas = [];

  let anchoCanvas = 0;

  let altoCanvas = 0;

  let tamanoFuente = 18;

  let animacionID = null;

  let ultimoFrame = 0;


  /*
    Aproximadamente 30 FPS.

    Esto hace que la animación siga siendo
    fluida pero consuma menos recursos que
    ejecutarla a 60 FPS constantemente.
  */

  const intervaloFrame = 1000 / 30;


  /* =====================================================
     UTILIDADES
  ===================================================== */

  function numeroAleatorio(minimo, maximo) {

    return (
      Math.random() *
      (maximo - minimo) +
      minimo
    );

  }


  function colorAleatorio() {

    return colores[
      Math.floor(
        Math.random() *
        colores.length
      )
    ];

  }


  function caracterAleatorio() {

    return caracteres[
      Math.floor(
        Math.random() *
        caracteres.length
      )
    ];

  }



  /* =====================================================
     CREAR UNA COLUMNA
  ===================================================== */

  function crearColumna(indice) {

    return {

      x:
        indice * tamanoFuente +
        tamanoFuente / 2,

      y:
        numeroAleatorio(
          -altoCanvas,
          altoCanvas
        ),

      velocidad:
        numeroAleatorio(
          1.2,
          3
        ),

      opacidad:
        numeroAleatorio(
          0.20,
          0.65
        ),

      color:
        colorAleatorio(),

      cambioCaracter:
        numeroAleatorio(
          0.02,
          0.08
        )

    };

  }



  /* =====================================================
     AJUSTAR CANVAS
  ===================================================== */

  function ajustarCanvas() {

    const hero =
      matrixCanvas.parentElement;


    if (!hero) {
      return;
    }


    /*
      En celular usamos caracteres
      ligeramente más pequeños.
    */

    if (window.innerWidth <= 768) {

      tamanoFuente = 16;

    } else {

      tamanoFuente = 18;

    }


    anchoCanvas =
      hero.clientWidth;

    altoCanvas =
      hero.clientHeight;


    /*
      Limitamos el pixel ratio a 2.

      Evita un consumo excesivo en
      pantallas de alta resolución.
    */

    const pixelRatio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    matrixCanvas.width =
      anchoCanvas * pixelRatio;

    matrixCanvas.height =
      altoCanvas * pixelRatio;


    matrixCanvas.style.width =
      anchoCanvas + "px";

    matrixCanvas.style.height =
      altoCanvas + "px";


    ctx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );


    /*
      Fondo inicial.
    */

    ctx.fillStyle =
      "#050507";

    ctx.fillRect(
      0,
      0,
      anchoCanvas,
      altoCanvas
    );


    /*
      Calculamos cuántas columnas
      entran en pantalla.
    */

    const cantidadColumnas =
      Math.ceil(
        anchoCanvas /
        tamanoFuente
      );


    columnas =
      Array.from(
        {
          length:
            cantidadColumnas
        },
        function (_, indice) {

          return crearColumna(indice);

        }
      );

  }



  /* =====================================================
     DIBUJAR MATRIX
  ===================================================== */

  function dibujarMatrix() {


    /*
      Capa negra transparente.

      No borramos completamente el frame
      anterior para conseguir las estelas.
    */

    ctx.fillStyle =
      "rgba(5, 5, 7, 0.11)";


    ctx.fillRect(
      0,
      0,
      anchoCanvas,
      altoCanvas
    );


    ctx.font =
      `500 ${tamanoFuente}px monospace`;


    ctx.textAlign =
      "center";


    ctx.textBaseline =
      "middle";


    columnas.forEach(
      function (columna) {


        /* =========================
           CARÁCTER
        ========================= */

        const simbolo =
          caracterAleatorio();



        /* =========================
           EFECTO CENTRAL

           Cerca del centro los caracteres
           son un poco más transparentes.

           De esta forma la animación
           "enmarca" el texto principal.
        ========================= */

        const distanciaCentro =
          Math.abs(
            columna.x -
            anchoCanvas / 2
          );


        const distanciaNormalizada =
          Math.min(
            distanciaCentro /
            (anchoCanvas / 2),
            1
          );


        const factorCentro =
          0.38 +
          distanciaNormalizada * 0.62;


        const opacidadFinal =
          columna.opacidad *
          factorCentro;



        /* =========================
           DIBUJAR
        ========================= */

        ctx.globalAlpha =
          opacidadFinal;


        ctx.fillStyle =
          columna.color;


        ctx.shadowColor =
          columna.color;


        ctx.shadowBlur =
          8;


        ctx.fillText(
          simbolo,
          columna.x,
          columna.y
        );



        /* =========================
           CABEZA MÁS BRILLANTE

           Algunas letras tienen un pequeño
           destello para dar profundidad.
        ========================= */

        if (Math.random() > 0.94) {

          ctx.globalAlpha =
            Math.min(
              opacidadFinal + 0.25,
              1
            );


          ctx.shadowBlur =
            15;


          ctx.fillText(
            simbolo,
            columna.x,
            columna.y
          );

        }



        /* =========================
           RESTAURAR SOMBRA
        ========================= */

        ctx.shadowBlur = 0;

        ctx.globalAlpha = 1;



        /* =========================
           MOVIMIENTO
        ========================= */

        columna.y +=
          columna.velocidad;



        /* =========================
           REINICIAR COLUMNA
        ========================= */

        if (
          columna.y >
          altoCanvas + 40
        ) {

          columna.y =
            numeroAleatorio(
              -300,
              -30
            );


          columna.velocidad =
            numeroAleatorio(
              1.2,
              3
            );


          columna.opacidad =
            numeroAleatorio(
              0.20,
              0.65
            );


          columna.color =
            colorAleatorio();

        }


        /* =========================
           CAMBIO OCASIONAL DE COLOR
        ========================= */

        if (
          Math.random() <
          columna.cambioCaracter * 0.015
        ) {

          columna.color =
            colorAleatorio();

        }

      }
    );

  }



  /* =====================================================
     LOOP DE ANIMACIÓN
  ===================================================== */

  function animarMatrix(tiempoActual) {

    animacionID =
      requestAnimationFrame(
        animarMatrix
      );


    const tiempoTranscurrido =
      tiempoActual -
      ultimoFrame;


    if (
      tiempoTranscurrido <
      intervaloFrame
    ) {

      return;

    }


    ultimoFrame =
      tiempoActual -
      (
        tiempoTranscurrido %
        intervaloFrame
      );


    dibujarMatrix();

  }



  /* =====================================================
     INICIAR MATRIX
  ===================================================== */

  function iniciarMatrix() {

    if (animacionID) {
      return;
    }


    animacionID =
      requestAnimationFrame(
        animarMatrix
      );

  }



  /* =====================================================
     DETENER MATRIX
  ===================================================== */

  function detenerMatrix() {

    if (!animacionID) {
      return;
    }


    cancelAnimationFrame(
      animacionID
    );


    animacionID = null;

  }



  /* =====================================================
     REDIMENSIONAR
  ===================================================== */

  let temporizadorResize;


  window.addEventListener(
    "resize",
    function () {

      clearTimeout(
        temporizadorResize
      );


      temporizadorResize =
        setTimeout(
          ajustarCanvas,
          150
        );

    }
  );



  /* =====================================================
     PAUSAR SI EL USUARIO CAMBIA DE PESTAÑA

     Evita gastar recursos innecesariamente.
  ===================================================== */

  document.addEventListener(
    "visibilitychange",
    function () {

      if (document.hidden) {

        detenerMatrix();

      } else {

        ultimoFrame =
          performance.now();

        iniciarMatrix();

      }

    }
  );



  /* =====================================================
     REDUCIR MOVIMIENTO

     Respeta la configuración de accesibilidad
     del dispositivo del usuario.
  ===================================================== */

  const reducirMovimiento =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  ajustarCanvas();


  if (!reducirMovimiento.matches) {

    iniciarMatrix();

  } else {

    /*
      Si el usuario desactiva animaciones,
      mostramos solamente un frame estático.
    */

    dibujarMatrix();

  }

}