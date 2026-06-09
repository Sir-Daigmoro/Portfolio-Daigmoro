# BattleFlow Framework

Sistema modular de combate RPG desarrollado en Unity con C#.

> Nombre interno del prototipo: **BattleV2**
> Nombre de presentación: **BattleFlow Framework**
> Enfoque técnico: **arquitectura modular, State Machine, ATB, targeting, cámara dinámica, presentación desacoplada y flujo táctico de combate**


# 1. Descripción general

**BattleFlow Framework** es un sistema de combate RPG diseñado como una base modular para construir batallas con flujo por estados, tiempo de acción, selección de objetivos, cámara dinámica, presentación visual desacoplada y resolución ordenada de acciones.

El sistema nace como una evolución de un prototipo de combate tradicional hacia una arquitectura más mantenible, donde cada parte del combate cumple una responsabilidad clara.

La intención principal no es solamente mostrar una batalla funcionando, sino demostrar cómo puede estructurarse un sistema de gameplay capaz de crecer sin transformar el código en una única clase centralizada difícil de mantener.

El proyecto se enfoca en responder tres preguntas principales:

```text
¿Qué es?
    Un framework modular para controlar el flujo de combate RPG.

¿Qué hace?
    Gestiona turnos, ATB, input, targeting, resolución de acciones,
    cámara, presentación visual y reintegración táctica.

¿Cómo lo hace?
    Mediante una arquitectura separada por responsabilidades:
    estados, controladores, resolvers, presenters e input desacoplado.
```


# 2. Origen del proyecto

El proyecto nace de una búsqueda personal por comprender cómo se construye un sistema de combate RPG desde su estructura interna, más allá de la interfaz, los ataques o la simple ejecución visual de una acción.

La idea inicial fue explorar qué ocurre realmente dentro de una batalla:

* Quién puede actuar.
* Cuándo puede actuar.
* Qué condiciones habilitan una acción.
* Cómo se selecciona un objetivo.
* Cómo se resuelve una acción.
* Cómo se comunica visualmente al jugador lo que está pasando.
* Cómo se mantiene el orden del sistema cuando aparecen más reglas.

A partir de esa exploración, el sistema evolucionó desde un combate por turnos básico hacia una propuesta más compleja, con elementos de ATB, selección de objetivos, cámara contextual, presentación visual y reposicionamiento táctico.

El foco no fue únicamente “hacer que el personaje ataque”, sino construir una arquitectura que permitiera sostener un sistema de combate más amplio.


# 3. Inspiración y búsqueda de diseño

BattleFlow Framework toma inspiración de sistemas de combate RPG donde el ritmo, la lectura del escenario y la toma de decisiones tienen peso.

La búsqueda principal fue alejarse de un combate excesivamente pasivo donde el jugador solo selecciona una opción de menú y espera el resultado.

El sistema busca generar una experiencia donde intervengan varias capas de decisión:

```text
Tiempo        → cuándo actuar.
Objetivo      → a quién atacar.
Posición      → desde dónde actuar.
Riesgo        → qué consecuencias tiene moverse.
Cámara        → cómo se comunica visualmente la acción.
Estado        → en qué fase del combate se encuentra el sistema.
Resolución    → qué ocurre después de confirmar una acción.
```

El resultado es una base híbrida entre combate RPG por turnos, ATB y lectura táctica de posiciones.


# 4. Problema técnico que busca resolver

En muchos prototipos de combate, la lógica suele crecer de manera directa dentro de pocos scripts.

Al inicio esto parece práctico, pero cuando aparecen más reglas, el sistema comienza a mezclar responsabilidades:

```text
Un mismo script puede terminar controlando:

- Input del jugador.
- Turnos.
- Cámara.
- UI.
- Animaciones.
- Daño.
- Selección de objetivos.
- Estados del combate.
- Movimiento táctico.
- Condiciones de victoria.
```

Ese enfoque puede funcionar en una demo pequeña, pero se vuelve difícil de escalar.

BattleFlow Framework busca evitar ese problema mediante una arquitectura donde cada capa tiene una función definida.


# 5. Principio central de diseño

El principio principal del sistema es:

```text
La lógica del combate no debe depender directamente de la presentación visual.
La presentación visual no debe decidir las reglas del combate.
El input no debe resolver por sí mismo las acciones.
El flujo debe estar centralizado en una máquina de estados.
```

Esto permite que el sistema sea más fácil de mantener, probar, extender y entender.

Diagrama conceptual:

```text
                        +--------------------+
                        | Input del jugador  |
                        +---------+----------+
                                |
                                v
                        +--------------------+
                        | Estado actual      |
                        | de combate         |
                        +---------+----------+
                                |
                                v
                        +--------------------+
                        | BattleFlowController|
                        +---------+----------+
                                |
                                v
                        +--------------------+
                        | Resolver lógico    |
                        | de acciones        |
                        +---------+----------+
                                |
                                v
                        +--------------------+
                        | Presentación visual|
                        | Cámara / UI / VFX  |
                        +--------------------+
```


# 6. Objetivo del sistema

El objetivo de BattleFlow Framework es construir una base técnica para combates RPG que permita controlar el flujo completo de la batalla de manera ordenada.

El sistema debe ser capaz de:

* Iniciar el combate.
* Preparar actores.
* Administrar el tiempo de acción.
* Abrir ventanas de input.
* Activar targeting.
* Resolver acciones.
* Actualizar la presentación visual.
* Controlar cámara y foco.
* Gestionar estados de combate.
* Reintegrar al personaje al flujo táctico.
* Mantener separada la lógica de la representación visual.


# 7. Concepto general del combate

BattleFlow Framework propone un combate donde el jugador participa dentro de un flujo estructurado por fases.

El sistema combina:

* Combate RPG.
* Flujo por turnos.
* ATB o carga de acción.
* Ventana de input.
* Targeting con cámara/bullet time.
* Resolución de acciones.
* Selección táctica de posición.
* Reintegración al ciclo de combate.

Flujo general simplificado:

```text
                        Inicio del combate
                                |
                                v
                        Preparación de actores
                                |
                                v
                        Carga ATB / espera de acción
                                |
                                v
                        Ventana de input del jugador
                                |
                                v
                        Targeting / selección de objetivo
                                |
                                v
                        Resolución de acción
                                |
                                v
                        Selección táctica de reintegración
                                |
                                v
                        Retorno al ciclo ATB
```

---

# 8. Arquitectura general

La arquitectura se organiza en capas para evitar dependencias innecesarias entre lógica, presentación e input.

```text
                        +-------------------------------------------------------+
                        |                  BattleFlow Framework                 |
                        +-------------------------------------------------------+
                        |                                                       |
                        |  +------------------+      +----------------------+   |
                        |  | Input Layer      | ---> | Battle States        |   |
                        |  |                  |      | State Machine        |   |
                        |  +------------------+      +----------+-----------+   |
                        |                                        |              |
                        |                                        v              |
                        |  +------------------+      +----------------------+   |
                        |  | Presentation     | <--- | BattleFlowController |   |
                        |  | Camera / UI / FX |      | Core Flow Controller |   |
                        |  +------------------+      +----------+-----------+   |
                        |                                        |              |
                        |                                        v              |
                        |                             +----------------------+  |
                        |                             | Action Resolver      |  |
                        |                             | Combat Rules         |  |
                        |                             +----------------------+  |
                        |                                                       |
                        +-------------------------------------------------------+
```

# 9. Capas del sistema

## 9.1 Core

La capa Core contiene las reglas principales del combate.

Responsabilidades:

* Coordinar el ciclo de combate.
* Mantener el estado actual.
* Definir transiciones.
* Ejecutar reglas de resolución.
* Determinar qué actores pueden actuar.
* Coordinar los cambios entre fases.

No debería encargarse de cámara, UI ni efectos visuales.

## 9.2 States

La capa de estados representa las fases del combate.

Cada estado responde a preguntas específicas:

```text
¿Qué ocurre en esta fase?
¿Qué acciones están permitidas?
¿Qué condiciones provocan una transición?
¿Cuál es el siguiente estado?
```

Ejemplos de estados del sistema:

```text
StartBattleState
WaitingForAtbBattleState
PlayerInputWindowState
TargetingBulletTimeState
ResolvingActionsBattleState
EnemyTurnState
TacticalFrontSelectionState
TacticalEnemySelectionState
TacticalPositionSelectionState
TacticalReintegrationState
```

## 9.3 Resolver

El resolver contiene la lógica que determina el resultado de una acción.

Su función no es mostrar la acción, sino resolverla.

Puede responder preguntas como:

```text
¿La acción es válida?
¿El objetivo está disponible?
¿La acción impacta?
¿Qué efecto produce?
¿Qué estado debe actualizarse?
¿Qué evento debe comunicarse a presentación?
```

## 9.4 Presentation

La capa Presentation traduce el estado interno del combate a elementos visibles para el jugador.

Responsabilidades:

* Control de cámara.
* Foco sobre actor activo.
* Indicadores visuales.
* Orbe o selector de input.
* UI de acción.
* Feedback visual.
* Transiciones.
* Animaciones o VFX.
* Lectura espacial de la escena.

La presentación no decide reglas internas. Solo representa visualmente lo que el sistema ya determinó.

## 9.5 Input

La capa de input interpreta la intención del jugador.

Responsabilidades:

* Leer botones o comandos.
* Detectar confirmación/cancelación.
* Navegar opciones.
* Activar targeting.
* Confirmar objetivo.
* Enviar intención al estado actual.

El input no debería ejecutar directamente daño, cambios de turno o lógica de combate.

# 10. Flujo principal de ejecución

Diagrama de alto nivel:

```text
                        +-------------------+
                        | StartBattleState  |
                        +---------+---------+
                                |
                                v
                        +---------------------------+
                        | WaitingForAtbBattleState  |
                        +---------+-----------------+
                                |
                                v
                        +--------------------------+
                        | PlayerInputWindowState   |
                        +---------+----------------+
                                |
                                v
                        +--------------------------+
                        | TargetingBulletTimeState |
                        +---------+----------------+
                                |
                                v
                        +-----------------------------+
                        | ResolvingActionsBattleState |
                        +---------+-------------------+
                                |
                                v
                        +------------------------------+
                        | TacticalFrontSelectionState  |
                        +---------+--------------------+
                                |
                                v
                        +------------------------------+
                        | TacticalEnemySelectionState  |
                        +---------+--------------------+
                                |
                                v
                        +--------------------------------+
                        | TacticalPositionSelectionState |
                        +---------+----------------------+
                                |
                                v
                        +-----------------------------+
                        | TacticalReintegrationState  |
                        +---------+-------------------+
                                |
                                v
                        +---------------------------+
                        | WaitingForAtbBattleState  |
                        +---------------------------+
```

# 11. State Machine

La máquina de estados es el eje del sistema.

En vez de controlar el combate con muchos `if` dispersos, cada fase tiene su propio estado.

Modelo ASCII:

```text
                         +-------------------+
                         | StartBattleState  |
                         +---------+---------+
                                   |
                                   v
                         +---------------------------+
                  +----> | WaitingForAtbBattleState  | <----+
                  |      +-------------+-------------+      |
                  |                    |                    |
                  |                    v                    |
                  |      +--------------------------+       |
                  |      | PlayerInputWindowState   |       |
                  |      +-------------+------------+       |
                  |                    |                    |
                  |                    v                    |
                  |      +--------------------------+       |
                  |      | TargetingBulletTimeState |       |
                  |      +-------------+------------+       |
                  |                    |                    |
                  |                    v                    |
                  |      +-----------------------------+    |
                  |      | ResolvingActionsBattleState |    |
                  |      +-------------+---------------+    |
                  |                    |                    |
                  |                    v                    |
                  |      +-----------------------------+    |
                  |      | TacticalReintegrationState  |----+
                  |      +-----------------------------+
                  |
                  |
                  |      +------------------+
                  +------| EnemyTurnState   |
                         +------------------+
```

Este modelo permite que el combate avance de forma controlada y que cada transición sea explícita.

---

# 12. Ciclo ATB

El ATB funciona como una capa de tiempo dentro del combate.

Mientras el combate está en espera, los actores cargan su tiempo de acción. Cuando un actor alcanza el umbral necesario, el sistema puede abrir una ventana de acción.

Flujo conceptual:

```text
                +---------------------------+
                | WaitingForAtbBattleState  |
                +-------------+-------------+
                            |
                            v
                    +------------------+
                    | Actualizar ATB   |
                    +--------+---------+
                            |
                            v
                    +----------------------+
                    | ¿Actor listo?        |
                    +----+-------------+---+
                        |             |
                       |No|          |Sí|
                        v             v
                +----------------+  +------------------------+
                | Continuar loop |  | Abrir ventana de input |
                +----------------+  +------------------------+
```

Representación por actor:

```text
Actor A: [##########] listo
Actor B: [######----] cargando
Actor C: [###-------] cargando
```

El ATB permite que el combate no dependa únicamente de un orden fijo, sino de un sistema de disponibilidad temporal.

# 13. Ventana de input del jugador

Cuando el actor del jugador está listo, el sistema abre una ventana de input.

Esta ventana representa el momento donde el jugador puede tomar una decisión.

```text
                        +-------------------------+
                        | PlayerInputWindowState  |
                        +-----------+-------------+
                                    |
                                    v
                        +--------------------------+
                        | Mostrar opciones / orbe  |
                        +-----------+--------------+
                                    |
                                    v
                        +--------------------------+
                        | Leer input del jugador   |
                        +-----+---------------+----+
                            |               |
                            v               v
                        Confirmar          Cancelar
                            |               |
                            v               v
                        Targeting       Volver / mantener estado
```

La intención del jugador se traduce a una acción pendiente, pero todavía no se resuelve completamente hasta pasar por las fases correspondientes.

# 14. Targeting y bullet time

El targeting permite seleccionar un objetivo de manera controlada.

El bullet time o ralentización contextual ayuda a separar el momento de decisión del flujo normal de combate.

Objetivo técnico:

```text
El jugador debe poder leer el escenario,
seleccionar un objetivo y confirmar una acción
sin que la batalla pierda claridad visual.
```

Flujo:

```text
                        +--------------------------+
                        | TargetingBulletTimeState |
                        +-------------+------------+
                                    |
                                    v
                        +---------------------------+
                        | Activar cámara contextual |
                        +-------------+-------------+
                                    |
                                    v
                        +----------------------------+
                        | Reducir ritmo / bullet time|
                        +-------------+--------------+
                                    |
                                    v
                        +----------------------------+
                        | Navegar objetivos válidos  |
                        +-------------+--------------+
                                    |
                                    v
                        +----------------------------+
                        | Confirmar objetivo         |
                        +-------------+--------------+
                                    |
                                    v
                        +-----------------------------+
                        | Encolar acción a resolver   |
                        +-----------------------------+
```

Modelo visual:

```text
                          Cámara
                            |
                            v
                    +--------------+
                    | Actor activo |
                    +------+-------+
                            |
                    Objetivo seleccionado
                            |
                            v
                    +--------------+
                    |   Enemigo    |
                    +--------------+
```


# 15. Cola de acciones

El sistema puede trabajar con una cola de acciones para separar la selección de la resolución.

Esto permite que una acción primero sea construida como intención y luego procesada en una fase dedicada.

        Jugador selecciona acción
                |
                v
        Jugador selecciona objetivo
                |
                v
        Se crea una acción pendiente
                |
                v
        La acción entra a la cola
                |
                v
        ResolvingActionsBattleState procesa la cola

Diagrama:

+--------------------+
| Acción confirmada  |
+---------+----------+
          |
          v
+--------------------+
| Action Queue       |
|--------------------|
| 1. Attack Enemy A  |
| 2. Skill Enemy B   |
| 3. Guard           |
+---------+----------+
          |
          v
+-----------------------------+
| ResolvingActionsBattleState |
+-----------------------------+

Ventaja técnica:

```text
La selección de la acción no está acoplada directamente
a su ejecución visual ni a su resolución lógica.
```

---

# 16. Resolución de acciones

La resolución ocurre en una fase específica.

Esto evita que el input, la UI o la cámara ejecuten directamente las consecuencias del combate.

Flujo:

```text
+-----------------------------+
| ResolvingActionsBattleState |
+-------------+---------------+
              |
              v
+-----------------------------+
| Obtener acción pendiente    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Validar actor y objetivo    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Aplicar reglas de combate   |
+-------------+---------------+
              |
              v
+-----------------------------+
| Generar resultado lógico    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Notificar a presentación    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Finalizar resolución        |
+-----------------------------+
```

Ejemplo de separación:

```text
Resolver lógico:
    "El ataque fue válido y golpeó al objetivo."

Presentation:
    "Mostrar cámara, animación, impacto y feedback visual."
```

---

# 17. Sistema táctico de frentes

El sistema considera una fase táctica posterior a la resolución, donde el personaje puede reintegrarse al combate seleccionando una posición.

La lógica táctica trabaja con frentes y posiciones contextuales.

Ejemplo de posiciones:

```text
                 [ Back ]
                    |
[ Left Flank ] -- [ Enemy ] -- [ Right Flank ]
                    |
                 [ Front ]
                    |
                 [ Player ]
```

Estas posiciones permiten modelar decisiones como:

* Atacar de frente.
* Buscar un flanco.
* Reposicionarse después de una acción.
* Evaluar el riesgo de una ruta.
* Considerar amenazas en el corredor hacia una posición.

---

# 18. Selección táctica

El flujo táctico se divide en varias fases para mantener claridad.

```text
ResolvingActionsBattleState
          |
          v
TacticalFrontSelectionState
          |
          v
TacticalEnemySelectionState
          |
          v
TacticalPositionSelectionState
          |
          v
TacticalReintegrationState
          |
          v
WaitingForAtbBattleState
```

Cada fase cumple una función:

```text
TacticalFrontSelectionState
    Selecciona el frente o zona de aproximación.

TacticalEnemySelectionState
    Define el enemigo o foco táctico.

TacticalPositionSelectionState
    Evalúa posiciones disponibles.

TacticalReintegrationState
    Mueve o reintegra al actor al flujo del combate.
```

---

# 19. Evaluación de posiciones tácticas

Una posición no debería ser válida solo porque existe visualmente en la escena.

Debe pasar por una evaluación lógica.

Modelo:

```text
+-------------------------+
| Posición candidata      |
+------------+------------+
             |
             v
+-------------------------+
| ¿Existe espacio?        |
+-----+---------------+---+
      |               |
     No              Sí
      |               |
      v               v
 Rechazar     +---------------------+
              | ¿Hay acceso?        |
              +-----+-----------+---+
                    |           |
                   No          Sí
                    |           |
                    v           v
               Rechazar   +----------------------+
                           | Evaluar amenazas     |
                           +----------+-----------+
                                      |
                                      v
                           +----------------------+
                           | Calcular riesgo      |
                           +----------------------+
```

---

# 20. Riesgo táctico

El sistema puede clasificar el riesgo de una posición según amenazas reales en el corredor de movimiento.

La evaluación no depende solo del tipo de slot, sino del contexto.

Modelo conceptual:

```text
Jugador ---------> Slot seleccionado
       \          
        \__ Amenazas en el corredor
```

Clasificación:

```text
0 amenazas + sin interferencia  → Low
1 amenaza o interferencia       → Medium
2+ amenazas                     → High
```

Representación:

```text
+-------------------+------------------+
| Condición         | Riesgo           |
+-------------------+------------------+
| Sin amenazas      | Low              |
| 1 amenaza         | Medium           |
| Interferencia     | Medium           |
| 2+ amenazas       | High             |
+-------------------+------------------+
```

Este enfoque permite que el sistema analice el riesgo de una acción táctica con mayor precisión.

---

# 21. Interferencias tácticas

Durante una reintegración táctica pueden aparecer interferencias.

Ejemplos conceptuales:

```text
Ataque de oportunidad
Intercepción
Duelo
Desvío
```

Modelo de interferencia:

```text
Jugador intenta moverse
          |
          v
Ruta hacia posición
          |
          v
¿Hay amenaza activa?
     |          |
    No         Sí
     |          |
     v          v
Mover      Ejecutar interferencia
```

El desvío puede modificar la posición final hacia una alternativa válida de menor ventaja táctica.

Ejemplo:

```text
Intento original:
    Back

Si hay desvío:
    Back -> Flank

Si el flanco tampoco es válido:
    Flank -> Front
```

---

# 22. Reintegración táctica

La reintegración táctica es la fase donde el actor vuelve al flujo general del combate después de una acción.

No se trata solo de mover al personaje, sino de actualizar su contexto táctico.

Flujo:

```text
+-----------------------------+
| TacticalReintegrationState  |
+-------------+---------------+
              |
              v
+-----------------------------+
| Recibir posición elegida    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Validar riesgo/interferencia|
+-------------+---------------+
              |
              v
+-----------------------------+
| Ejecutar movimiento visual  |
+-------------+---------------+
              |
              v
+-----------------------------+
| Actualizar contexto táctico |
+-------------+---------------+
              |
              v
+-----------------------------+
| Volver a WaitingForAtb      |
+-----------------------------+
```

---

# 23. Cámara dinámica

La cámara cumple una función de comunicación visual.

No solo muestra la escena, sino que ayuda al jugador a entender el estado actual del combate.

La cámara puede cambiar su foco según:

* Actor activo.
* Objetivo seleccionado.
* Acción en resolución.
* Fase de targeting.
* Fase táctica.
* Resultado de una acción.

Modelo:

```text
+--------------------+
| Estado de combate  |
+---------+----------+
          |
          v
+--------------------+
| Solicitud visual   |
+---------+----------+
          |
          v
+--------------------+
| Camera Presenter   |
+---------+----------+
          |
          v
+--------------------+
| Foco / transición  |
+--------------------+
```

Ejemplo de lectura:

```text
Actor activo listo
        |
        v
Cámara enfoca actor
        |
        v
Jugador entra en targeting
        |
        v
Cámara ajusta foco al objetivo
        |
        v
Acción resuelta
        |
        v
Cámara muestra impacto o retorno
```

---

# 24. Presentación visual desacoplada

La presentación visual se encarga de representar el estado del combate sin decidir reglas.

Esto permite que una misma lógica pueda representarse de distintas formas.

Ejemplo:

```text
Lógica:
    El actor A ataca al actor B.

Presentación:
    - Enfocar cámara.
    - Reproducir animación.
    - Mostrar indicador.
    - Mostrar impacto.
    - Actualizar UI.
```

Separación:

```text
+-----------------------+       +-------------------------+
| Resultado lógico      | ----> | Presentación visual     |
+-----------------------+       +-------------------------+
| Acción válida         |       | Animación               |
| Objetivo impactado    |       | Cámara                  |
| Daño aplicado         |       | UI                      |
| Estado actualizado    |       | Feedback                |
+-----------------------+       +-------------------------+
```

---

# 25. Orbe / input visual

El orbe o grimorio funciona como una representación visual del input o de la disponibilidad de acción del jugador.

Está asociado al personaje y permite reforzar visualmente que el jugador se encuentra en una fase donde puede interactuar.

Modelo conceptual:

```text
        Cámara
          |
          v
   +--------------+
   |   Player     |
   |      O       |  <- Orbe / grimorio world-space
   +--------------+
```

Responsabilidad del presenter:

```text
- Posicionar el orbe.
- Mantenerlo visible.
- Ajustarlo al foco de cámara.
- Evitar que interfiera con la lógica del combate.
- Representar disponibilidad de acción.
```

El orbe no decide las reglas del combate. Solo comunica visualmente un estado.

---

# 26. Componentes principales

## 26.1 BattleFlowController

Coordina el flujo principal del combate.

Responsabilidades:

```text
- Inicializar el combate.
- Mantener el estado actual.
- Cambiar entre estados.
- Coordinar la resolución.
- Comunicar eventos relevantes.
- Evitar que cada script controle el flujo por separado.
```

Representación:

```text
+------------------------+
| BattleFlowController   |
+------------------------+
| CurrentState           |
| Actors                 |
| ActionQueue            |
| TacticalContext        |
+------------+-----------+
             |
             v
+------------------------+
| ChangeState(nextState) |
+------------------------+
```

---

## 26.2 Battle States

Los estados dividen el comportamiento del combate.

Cada estado debería tener una responsabilidad clara.

Ejemplo:

```text
StartBattleState
    Prepara el combate.

WaitingForAtbBattleState
    Espera que un actor esté listo para actuar.

PlayerInputWindowState
    Permite al jugador tomar una decisión.

TargetingBulletTimeState
    Permite seleccionar objetivo.

ResolvingActionsBattleState
    Resuelve acciones pendientes.

TacticalReintegrationState
    Devuelve al actor al flujo táctico.
```

---

## 26.3 Action Resolver

Resuelve acciones sin encargarse de cámara ni UI.

```text
Input confirmado
        |
        v
Acción construida
        |
        v
Resolver lógico
        |
        v
Resultado de combate
        |
        v
Evento para presentación
```

---

## 26.4 Presenters

Los presenters conectan lógica y escena.

Ejemplos de presenters:

```text
BattleInputOrbPresenter
BattleCameraPresenter
BattleUIPresenter
BattleTargetPresenter
BattleScenePresentationBootstrap
```

Responsabilidades:

```text
- Mostrar estado visual.
- Posicionar elementos.
- Actualizar cámara.
- Sincronizar UI.
- Mostrar foco.
- Comunicar feedback.
```

---

## 26.5 Bootstrap de escena

El bootstrap prepara la escena de combate y conecta referencias iniciales.

Su objetivo es evitar que cada componente tenga que buscar manualmente todo lo que necesita.

Modelo:

```text
+-------------------------------+
| BattleScenePresentationBootstrap |
+---------------+---------------+
                |
                v
+-------------------------------+
| Busca / recibe referencias    |
+---------------+---------------+
                |
                v
+-------------------------------+
| Configura presenters          |
+---------------+---------------+
                |
                v
+-------------------------------+
| Entrega control al Flow       |
+-------------------------------+
```

---

# 27. Comunicación entre capas

El sistema debe evitar dependencias circulares.

Modelo deseado:

```text
Input
  |
  v
State
  |
  v
Controller
  |
  v
Resolver
  |
  v
Events / Results
  |
  v
Presentation
```

Modelo a evitar:

```text
Input cambia cámara
Cámara decide daño
UI cambia estado
Animación define turno
Resolver lee botones
```

El segundo modelo genera acoplamiento y vuelve difícil mantener el sistema.

---

# 28. Flujo de una acción del jugador

```text
+--------------------------+
| Actor tiene ATB listo    |
+------------+-------------+
             |
             v
+--------------------------+
| Se abre input del jugador|
+------------+-------------+
             |
             v
+--------------------------+
| Jugador selecciona acción|
+------------+-------------+
             |
             v
+--------------------------+
| Se activa targeting      |
+------------+-------------+
             |
             v
+--------------------------+
| Jugador confirma objetivo|
+------------+-------------+
             |
             v
+--------------------------+
| Se construye acción      |
+------------+-------------+
             |
             v
+--------------------------+
| Acción entra a resolución|
+------------+-------------+
             |
             v
+--------------------------+
| Resolver aplica reglas   |
+------------+-------------+
             |
             v
+--------------------------+
| Presenters muestran acción|
+------------+-------------+
             |
             v
+--------------------------+
| Sistema pasa a táctica   |
+------------+-------------+
             |
             v
+--------------------------+
| Retorna al ciclo ATB     |
+--------------------------+
```

---

# 29. Flujo de cámara durante una acción

```text
Inicio de turno del actor
          |
          v
Cámara enfoca actor activo
          |
          v
Jugador entra a targeting
          |
          v
Cámara ajusta foco al objetivo
          |
          v
Jugador confirma acción
          |
          v
Cámara muestra resolución
          |
          v
Cámara acompaña reintegración táctica
          |
          v
Cámara vuelve al estado de espera
```

---

# 30. Flujo táctico de posición

```text
Acción resuelta
      |
      v
Seleccionar frente
      |
      v
Seleccionar enemigo o foco táctico
      |
      v
Mostrar posiciones candidatas
      |
      v
Evaluar disponibilidad
      |
      v
Evaluar acceso
      |
      v
Evaluar amenazas
      |
      v
Calcular riesgo
      |
      v
Confirmar posición
      |
      v
Ejecutar reintegración
      |
      v
Retornar a espera ATB
```

---

# 31. Modelo conceptual de datos

El sistema puede entenderse a partir de varias entidades conceptuales.

```text
BattleContext
    Contiene el estado general de la batalla.

BattleActor
    Representa un participante del combate.

BattleAction
    Representa una acción seleccionada o pendiente.

ActionResult
    Representa el resultado lógico de una acción.

TacticalContext
    Representa el estado táctico de posiciones y frentes.

BattleState
    Representa una fase del flujo de combate.

Presenter
    Representa visualmente datos o eventos del sistema.
```

Diagrama:

```text
+------------------+
| BattleContext    |
+--------+---------+
         |
         +------------------+
         |                  |
         v                  v
+------------------+   +------------------+
| BattleActor      |   | TacticalContext  |
+------------------+   +------------------+
         |
         v
+------------------+
| BattleAction     |
+--------+---------+
         |
         v
+------------------+
| ActionResult     |
+--------+---------+
         |
         v
+------------------+
| Presentation     |
+------------------+
```

---

# 32. Separación lógica vs visual

Uno de los valores más importantes del sistema es separar lo que ocurre de cómo se muestra.

```text
Qué ocurre:
    - Actor ataca.
    - Objetivo recibe impacto.
    - Estado cambia.
    - Acción finaliza.

Cómo se muestra:
    - Cámara enfoca.
    - Animación se reproduce.
    - UI se actualiza.
    - Feedback aparece.
```

Tabla conceptual:

```text
+----------------------+-----------------------------+
| Lógica               | Presentación                |
+----------------------+-----------------------------+
| Valida acción        | Muestra selección           |
| Calcula resultado    | Reproduce animación         |
| Cambia estado        | Cambia cámara               |
| Actualiza contexto   | Actualiza UI                |
| Controla flujo       | Muestra feedback            |
+----------------------+-----------------------------+
```

---

# 33. Patrones y conceptos aplicados

## State Machine

Permite dividir el combate en fases controladas.

```text
Estado actual -> Condición -> Nuevo estado
```

Ventaja:

```text
Evita que el combate dependa de lógica dispersa.
```

---

## Separation of Concerns

Cada componente tiene una responsabilidad clara.

```text
Input       → intención del jugador.
State       → fase actual del combate.
Controller  → coordinación del flujo.
Resolver    → reglas y resultados.
Presenter   → representación visual.
```

---

## Presentation Layer

La presentación se desacopla de la lógica.

Esto permite modificar cámara, UI o feedback sin cambiar las reglas internas.

---

## Action Queue

La acción seleccionada puede ser encolada antes de resolverse.

Esto ordena la ejecución y permite separar decisión de resolución.

---

## Tactical Context

El combate no se limita al actor y su objetivo, sino que incorpora posición, riesgo, frentes e interferencias.

---

# 34. Restricciones técnicas del proyecto

El sistema fue desarrollado como un módulo separado.

Una restricción importante fue mantener BattleV2 desacoplado del sistema anterior.

```text
Assets/Systems/Battle      -> Sistema anterior
Assets/Systems/BattleV2    -> Sistema nuevo y modular
```

Regla de trabajo:

```text
No modificar el sistema anterior.
Construir BattleV2 como una arquitectura independiente.
```

Esto permite comparar versiones, mantener estabilidad y evolucionar el nuevo sistema sin romper implementaciones previas.

---

# 35. Estructura conceptual del módulo

Estructura referencial:

```text
Assets/
└── Systems/
    └── BattleV2/
        ├── Core/
        │   ├── BattleFlowController.cs
        │   ├── BattleContext.cs
        │   ├── BattleActor.cs
        │   └── BattleAction.cs
        │
        ├── States/
        │   ├── StartBattleState.cs
        │   ├── WaitingForAtbBattleState.cs
        │   ├── PlayerInputWindowState.cs
        │   ├── TargetingBulletTimeState.cs
        │   ├── ResolvingActionsBattleState.cs
        │   └── TacticalReintegrationState.cs
        │
        ├── Presentation/
        │   ├── BattleInputOrbPresenter.cs
        │   ├── BattleCameraPresenter.cs
        │   ├── BattleUIPresenter.cs
        │   └── BattleScenePresentationBootstrap.cs
        │
        ├── Tactical/
        │   ├── TacticalFrontSelection.cs
        │   ├── TacticalPositionSelection.cs
        │   ├── TacticalRiskEvaluator.cs
        │   └── TacticalEngagementContext.cs
        │
        └── Input/
            └── BattleInputReader.cs
```

Esta estructura representa la intención arquitectónica: separar flujo, estados, presentación, táctica e input.

---

# 36. Lectura técnica de la demo

La demo muestra el sistema funcionando como una secuencia completa de combate.

Lectura por fases:

```text
1. El combate inicia.
2. El sistema prepara actores.
3. La cámara enfoca al personaje correspondiente.
4. El ATB determina disponibilidad de acción.
5. El jugador entra en ventana de input.
6. El sistema activa targeting.
7. Se confirma una acción.
8. La acción pasa a resolución.
9. La presentación visual comunica el resultado.
10. El sistema abre la fase táctica.
11. El jugador selecciona posición.
12. El personaje se reintegra al flujo.
13. El combate retorna a espera ATB.
```

La importancia de la demo está en mostrar que el combate no funciona como una secuencia improvisada, sino como una serie de estados conectados.

---

# 37. Valor técnico

BattleFlow Framework demuestra capacidad para diseñar un sistema de gameplay desde arquitectura y no solo desde comportamiento visual.

Su valor técnico está en:

```text
- Modularización.
- Separación de responsabilidades.
- Uso de State Machine.
- Control de flujo centralizado.
- Input desacoplado.
- Presentación visual separada.
- Cámara contextual.
- Resolución lógica de acciones.
- Sistema táctico de posiciones.
- Evaluación de riesgo.
- Reintegración al ciclo de combate.
```

Esto lo convierte en un proyecto útil para demostrar pensamiento sistémico, dominio de Unity, programación orientada a objetos y diseño de sistemas de gameplay.

---

# 38. Valor para desarrollo de videojuegos

Desde una perspectiva de desarrollo de videojuegos, el sistema muestra varias competencias importantes:

```text
Diseño de gameplay:
    Traduce una idea de combate a reglas y fases concretas.

Arquitectura:
    Organiza el sistema para evitar acoplamiento excesivo.

Programación:
    Implementa flujo, estados, input y presentación.

UX de combate:
    Usa cámara, foco y feedback para comunicar información al jugador.

Escalabilidad:
    Permite que nuevas reglas puedan integrarse sin rehacer todo.
```

---

# 39. Resumen técnico corto

**BattleFlow Framework** es un sistema modular de combate RPG desarrollado en Unity con C#. Su arquitectura separa lógica, estados, input, resolución y presentación visual. El sistema utiliza una máquina de estados para controlar el flujo del combate, incorpora ATB, targeting, cámara dinámica, acción encolada, resolución lógica y reintegración táctica mediante selección de posiciones.

El proyecto fue diseñado como una evolución de un prototipo de combate hacia una base técnica más escalable y mantenible.

---

# 40. Resumen para portfolio

**BattleFlow Framework** es un framework de combate RPG desarrollado en Unity, enfocado en arquitectura modular y flujo de combate por estados.

El sistema controla ATB, input del jugador, targeting, resolución de acciones, cámara dinámica, presentación visual y posicionamiento táctico.

Su principal valor está en la separación entre lógica y presentación, permitiendo que el combate pueda crecer sin concentrar todas las reglas en scripts monolíticos.

---

# 41. Conclusión

BattleFlow Framework es una base técnica para un sistema de combate RPG modular, táctico y escalable.

El proyecto nace de la necesidad de comprender y construir el corazón de una batalla RPG desde su arquitectura interna: turnos, tiempo de acción, selección de objetivos, cámara, resolución, táctica y presentación visual.

Su mayor fortaleza no está únicamente en mostrar una batalla funcionando, sino en demostrar una forma ordenada de construir sistemas de gameplay complejos dentro de Unity.

El sistema transforma una idea de combate en una estructura técnica clara, donde cada componente tiene una responsabilidad definida y donde la lógica del combate puede evolucionar sin depender directamente de la cámara, la UI o los efectos visuales.
