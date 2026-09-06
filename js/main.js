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
  {
    passive: true
  }
);


/*
  Ejecutamos una vez por si la página
  carga estando scrolleada.
*/

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

    "#7c3aed",

    "#8b5cf6",

    "#a78bfa",

    "#6366f1",

    "#3b82f6",

    "#c4b5fd"

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

    Mantiene la animación fluida
    sin consumir recursos innecesarios.
  */

  const intervaloFrame =
    1000 / 30;



  /* =====================================================
     UTILIDADES MATRIX
  ===================================================== */

  function numeroAleatorio(
    minimo,
    maximo
  ) {

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
     CREAR COLUMNA
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
      Limitamos pixel ratio a 2.
    */

    const pixelRatio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    matrixCanvas.width =
      anchoCanvas *
      pixelRatio;


    matrixCanvas.height =
      altoCanvas *
      pixelRatio;


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
      Calculamos cantidad de columnas.
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

          return crearColumna(
            indice
          );

        }
      );

  }



  /* =====================================================
     DIBUJAR MATRIX
  ===================================================== */

  function dibujarMatrix() {

    /*
      Rectángulo transparente.

      Al no borrar completamente
      conseguimos las estelas.
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
           ZONA CENTRAL MÁS LIMPIA
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
          distanciaNormalizada *
          0.62;


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
           DESTELLO
        ========================= */

        if (
          Math.random() >
          0.94
        ) {

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
           RESTAURAR
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
           CAMBIAR COLOR
        ========================= */

        if (
          Math.random() <
          columna.cambioCaracter *
          0.015
        ) {

          columna.color =
            colorAleatorio();

        }

      }
    );

  }



  /* =====================================================
     LOOP MATRIX
  ===================================================== */

  function animarMatrix(
    tiempoActual
  ) {

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
     PAUSAR CUANDO CAMBIAMOS DE PESTAÑA
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
     ACCESIBILIDAD
  ===================================================== */

  const reducirMovimiento =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );



  /* =====================================================
     INICIALIZACIÓN MATRIX
  ===================================================== */

  ajustarCanvas();


  if (
    !reducirMovimiento.matches
  ) {

    iniciarMatrix();

  } else {

    /*
      Si el usuario tiene reducidas
      las animaciones mostramos
      solamente un frame.
    */

    dibujarMatrix();

  }

}



/* =========================================================
   PROYECTOS
========================================================= */


/*
  En este objeto guardamos toda la información
  de los proyectos.

  Las cards del HTML solamente necesitan
  indicar:

  data-proyecto="azrael"
  data-proyecto="vecino"
  data-proyecto="nebula"
*/

const proyectosData = {


  /* =====================================================
     AZRAEL HOOKED
  ===================================================== */

  azrael: {

    titulo:
      "Azrael Hooked",


    categoria:
      "Desktop App",


    imagenes: [

      "assets/imagenes/Azrael-Launcher.png",

      "assets/imagenes/Azrael-Launcher-2.png"

    ],


    descripcion:
      "Azrael Hooked es una aplicación de escritorio privada desarrollada como launcher y centro de herramientas para una plataforma de juego retro. El proyecto combina una interfaz modular con autenticación de usuarios, gestión de sesiones y comunicación con distintos servicios internos.",


    utilidad:
      "Su objetivo es centralizar el acceso a la plataforma, la sesión del usuario, configuraciones y distintas herramientas dentro de una única aplicación. También permite organizar funciones de diagnóstico, administración y control desde una interfaz gráfica.",


    caracteristicas: [

      "Interfaz gráfica modular desarrollada en Python.",

      "Sistema de autenticación y gestión de sesiones.",

      "Perfiles, permisos y roles de usuario.",

      "Comunicación cliente-servidor mediante API.",

      "Paneles independientes para diferentes herramientas.",

      "Sistema de logs y diagnóstico.",

      "Configuraciones locales y persistencia de datos.",

      "Herramientas de red y configuración de proxy local.",

      "Atajos de teclado y acciones configurables.",

      "Arquitectura preparada para incorporar nuevos módulos."

    ],


    tecnologias: [

      "Python",

      "Flet",

      "REST API",

      "JWT",

      "JSON",

      "HTTP",

      "Networking",

      "Windows API",

      "Client-Server"

    ]

  },



  /* =====================================================
     VECINOSERVICIO
  ===================================================== */

  vecino: {

    titulo:
      "VecinoServicio",


    categoria:
      "Aplicación",


    imagenes: [

      "assets/imagenes/vecino-1.png"

    ],


    descripcion:
      "VecinoServicio es un prototipo de aplicación orientado a conectar usuarios con profesionales de servicios locales mediante una interfaz moderna diseñada principalmente para dispositivos móviles.",


    utilidad:
      "Permite que una persona pueda buscar de manera sencilla profesionales de diferentes categorías como plomería, electricidad, pintura, jardinería y otros servicios. Al mismo tiempo, ofrece una estructura donde los profesionales pueden presentar sus servicios a potenciales clientes.",


    caracteristicas: [

      "Interfaz gráfica desarrollada con Flet.",

      "Diseño orientado a dispositivos móviles.",

      "Sistema de categorías de servicios.",

      "Perfiles de profesionales.",

      "Valoraciones e información de cada profesional.",

      "Navegación entre diferentes vistas.",

      "Formulario para profesionales.",

      "Componentes reutilizables.",

      "Diseño enfocado en facilidad de uso."

    ],


    tecnologias: [

      "Python",

      "Flet",

      "UI / UX",

      "Responsive Design"

    ]

  },



  /* =====================================================
     NEBULA DEV
  ===================================================== */

  nebula: {

    titulo:
      "Nebula Dev",


    categoria:
      "Desarrollo Web",


    imagenes: [

      "assets/imagenes/Nebula-1.png",

      "assets/imagenes/Nebula-2.png"

    ],


    descripcion:
      "Nebula Dev es un sitio web desarrollado desde cero como portfolio y presencia digital profesional. El proyecto combina desarrollo frontend, diseño responsive, animaciones personalizadas y una identidad visual inspirada en tonos violetas, lilas y azules.",


    utilidad:
      "Funciona como portfolio profesional para presentar servicios, proyectos realizados, tecnologías utilizadas, redes sociales y medios de contacto. También sirve como base para futuros sitios web comerciales y proyectos para clientes.",


    caracteristicas: [

      "Diseño completamente responsive.",

      "HTML semántico y estructura organizada.",

      "CSS personalizado sin frameworks.",

      "JavaScript desarrollado desde cero.",

      "Navbar dinámica y menú responsive.",

      "Navegación suave entre secciones.",

      "Animación Matrix personalizada mediante Canvas.",

      "Galería interactiva de proyectos.",

      "Sección de redes sociales.",

      "Formulario de contacto preparado para integración.",

      "Control de versiones mediante Git y GitHub.",

      "Deployment automático conectado al repositorio.",

      "Hosting mediante Cloudflare Workers."

    ],


    tecnologias: [

      "HTML5",

      "CSS3",

      "JavaScript",

      "Canvas API",

      "Responsive Design",

      "Git",

      "GitHub",

      "Cloudflare"

    ]

  }

};



/* =========================================================
   ELEMENTOS DEL PANEL DE PROYECTOS
========================================================= */

const proyectoDetalle =
  document.getElementById(
    "proyecto-detalle"
  );


const detalleImagen =
  document.getElementById(
    "detalle-imagen"
  );


const detalleMiniaturas =
  document.getElementById(
    "detalle-miniaturas"
  );


const detalleCategoria =
  document.getElementById(
    "detalle-categoria"
  );


const detalleTitulo =
  document.getElementById(
    "detalle-titulo"
  );


const detalleDescripcion =
  document.getElementById(
    "detalle-descripcion"
  );


const detalleUtilidad =
  document.getElementById(
    "detalle-utilidad"
  );


const detalleCaracteristicasBloque =
  document.getElementById(
    "detalle-caracteristicas-bloque"
  );


const detalleCaracteristicas =
  document.getElementById(
    "detalle-caracteristicas"
  );


const detalleTecnologias =
  document.getElementById(
    "detalle-tecnologias"
  );


const detalleCerrar =
  document.getElementById(
    "detalle-cerrar"
  );


const botonesProyecto =
  document.querySelectorAll(
    ".proyecto-ver"
  );


let proyectoActual = null;



/* =========================================================
   CAMBIAR IMAGEN PRINCIPAL
========================================================= */

function cambiarImagenProyecto(
  imagen,
  titulo
) {

  if (!detalleImagen) {
    return;
  }


  /*
    Pequeño fade para que el cambio
    de captura sea más agradable.
  */

  detalleImagen.style.opacity =
    "0";


  setTimeout(
    function () {

      detalleImagen.src =
        imagen;


      detalleImagen.alt =
        `Captura del proyecto ${titulo}`;


      detalleImagen.style.opacity =
        "1";

    },
    120
  );

}



/* =========================================================
   CREAR MINIATURAS
========================================================= */

function crearMiniaturas(
  proyecto
) {

  if (!detalleMiniaturas) {
    return;
  }


  detalleMiniaturas.innerHTML =
    "";


  /*
    Si solamente hay una imagen,
    no necesitamos mostrar miniaturas.
  */

  if (
    proyecto.imagenes.length <= 1
  ) {

    detalleMiniaturas.style.display =
      "none";


    return;

  }


  detalleMiniaturas.style.display =
    "flex";


  proyecto.imagenes.forEach(
    function (
      imagen,
      indice
    ) {

      const boton =
        document.createElement(
          "button"
        );


      boton.type =
        "button";


      boton.className =
        "detalle-miniatura";


      /*
        La primera captura empieza activa.
      */

      if (indice === 0) {

        boton.classList.add(
          "active"
        );

      }


      boton.setAttribute(
        "aria-label",
        `Ver captura ${indice + 1} de ${proyecto.titulo}`
      );


      const miniatura =
        document.createElement(
          "img"
        );


      miniatura.src =
        imagen;


      miniatura.alt =
        `Miniatura ${indice + 1} de ${proyecto.titulo}`;


      boton.appendChild(
        miniatura
      );


      boton.addEventListener(
        "click",
        function () {

          cambiarImagenProyecto(
            imagen,
            proyecto.titulo
          );


          /*
            Quitamos active de todas.
          */

          detalleMiniaturas
            .querySelectorAll(
              ".detalle-miniatura"
            )
            .forEach(
              function (
                otraMiniatura
              ) {

                otraMiniatura
                  .classList
                  .remove(
                    "active"
                  );

              }
            );


          boton.classList.add(
            "active"
          );

        }
      );


      detalleMiniaturas.appendChild(
        boton
      );

    }
  );

}



/* =========================================================
   CREAR CARACTERÍSTICAS
========================================================= */

function crearCaracteristicas(
  proyecto
) {

  if (
    !detalleCaracteristicas ||
    !detalleCaracteristicasBloque
  ) {

    return;

  }


  detalleCaracteristicas.innerHTML =
    "";


  /*
    Si un proyecto no tiene características
    ocultamos todo el bloque.
  */

  if (
    !proyecto.caracteristicas ||
    proyecto.caracteristicas.length === 0
  ) {

    detalleCaracteristicasBloque
      .style
      .display =
      "none";


    return;

  }


  detalleCaracteristicasBloque
    .style
    .display =
    "block";


  proyecto.caracteristicas.forEach(
    function (caracteristica) {

      const item =
        document.createElement(
          "li"
        );


      item.textContent =
        caracteristica;


      detalleCaracteristicas
        .appendChild(
          item
        );

    }
  );

}



/* =========================================================
   CREAR TECNOLOGÍAS
========================================================= */

function crearTecnologias(
  proyecto
) {

  if (!detalleTecnologias) {
    return;
  }


  detalleTecnologias.innerHTML =
    "";


  proyecto.tecnologias.forEach(
    function (tecnologia) {

      const etiqueta =
        document.createElement(
          "span"
        );


      etiqueta.textContent =
        tecnologia;


      detalleTecnologias
        .appendChild(
          etiqueta
        );

    }
  );

}



/* =========================================================
   ACTUALIZAR BOTONES
========================================================= */

function actualizarBotonesProyecto(
  proyectoID
) {

  botonesProyecto.forEach(
    function (boton) {

      const esActivo =
        boton.dataset.proyecto ===
        proyectoID;


      boton.setAttribute(
        "aria-expanded",
        esActivo ?
          "true" :
          "false"
      );


      const flecha =
        boton.querySelector(
          "span"
        );


      if (flecha) {

        flecha.textContent =
          esActivo ?
            "↑" :
            "↓";

      }

    }
  );

}



/* =========================================================
   MOSTRAR PROYECTO
========================================================= */

function mostrarProyecto(
  proyectoID
) {

  const proyecto =
    proyectosData[
      proyectoID
    ];


  if (
    !proyecto ||
    !proyectoDetalle
  ) {

    return;

  }


  /* =====================================================
     IMAGEN PRINCIPAL
  ===================================================== */

  if (
    proyecto.imagenes &&
    proyecto.imagenes.length > 0
  ) {

    cambiarImagenProyecto(
      proyecto.imagenes[0],
      proyecto.titulo
    );

  }



  /* =====================================================
     TEXTO
  ===================================================== */

  if (detalleCategoria) {

    detalleCategoria.textContent =
      proyecto.categoria;

  }


  if (detalleTitulo) {

    detalleTitulo.textContent =
      proyecto.titulo;

  }


  if (detalleDescripcion) {

    detalleDescripcion.textContent =
      proyecto.descripcion;

  }


  if (detalleUtilidad) {

    detalleUtilidad.textContent =
      proyecto.utilidad;

  }



  /* =====================================================
     GALERÍA
  ===================================================== */

  crearMiniaturas(
    proyecto
  );



  /* =====================================================
     CARACTERÍSTICAS
  ===================================================== */

  crearCaracteristicas(
    proyecto
  );



  /* =====================================================
     TECNOLOGÍAS
  ===================================================== */

  crearTecnologias(
    proyecto
  );



  /* =====================================================
     ABRIR PANEL
  ===================================================== */

  proyectoDetalle.classList.add(
    "active"
  );


  proyectoDetalle.setAttribute(
    "aria-hidden",
    "false"
  );


  proyectoActual =
    proyectoID;


  actualizarBotonesProyecto(
    proyectoID
  );



  /* =====================================================
     SCROLL HACIA EL PANEL
  ===================================================== */

  setTimeout(
    function () {

      proyectoDetalle.scrollIntoView({

        behavior:
          "smooth",

        block:
          "nearest"

      });

    },
    180
  );

}



/* =========================================================
   CERRAR DETALLE
========================================================= */

function cerrarDetalleProyecto() {

  if (!proyectoDetalle) {
    return;
  }


  /* =====================================================
     VOLVER A LA SECCIÓN PROYECTOS
  ===================================================== */

  const seccionProyectos =
    document.getElementById(
      "proyectos"
    );


  /*
    Primero hacemos scroll hacia Proyectos
    mientras el panel todavía conserva su altura.

    Esto evita que al cerrarse el panel
    el navegador termine desplazándonos
    hacia la siguiente sección.
  */

  if (seccionProyectos) {

    seccionProyectos.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  }


  /* =====================================================
     CERRAR PANEL
  ===================================================== */

  /*
    Esperamos un poquito para que comience
    el scroll antes de contraer el panel.
  */

  setTimeout(
    function () {

      proyectoDetalle.classList.remove(
        "active"
      );


      proyectoDetalle.setAttribute(
        "aria-hidden",
        "true"
      );


      proyectoActual =
        null;


      actualizarBotonesProyecto(
        null
      );

    },
    180
  );

}



/* =========================================================
   BOTONES VER DETALLES
========================================================= */

botonesProyecto.forEach(
  function (boton) {

    boton.addEventListener(
      "click",
      function () {

        const proyectoID =
          boton.dataset.proyecto;


        /*
          Si hacemos click en el proyecto
          que ya está abierto,
          lo cerramos.
        */

        if (
          proyectoActual ===
            proyectoID &&
          proyectoDetalle &&
          proyectoDetalle.classList.contains(
            "active"
          )
        ) {

          cerrarDetalleProyecto();


          return;

        }


        /*
          Si seleccionamos otro,
          cambiamos el contenido.
        */

        mostrarProyecto(
          proyectoID
        );

      }
    );

  }
);



/* =========================================================
   BOTÓN CERRAR
========================================================= */

if (detalleCerrar) {

  detalleCerrar.addEventListener(
    "click",
    cerrarDetalleProyecto
  );

}



/* =========================================================
   TECLA ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      proyectoDetalle &&
      proyectoDetalle
        .classList
        .contains(
          "active"
        )
    ) {

      cerrarDetalleProyecto();

    }

  }
);