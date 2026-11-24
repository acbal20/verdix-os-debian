# VERDIX Rust Edition — diseño experimental

**Estado:** propuesta / rama experimental. No reemplaza al ISO live actual ni
implica reescribir Linux. El objetivo es sustituir piezas de userspace de VERDIX
por servicios Rust pequeños, ejecutándose sobre la misma base Debian live que ya
arranca en el Lenovo Celeron 4205U (4 GB RAM, HDD).

## Principios

1. El kernel y el initrd siguen siendo Linux/Debian; no se escribe un kernel propio.
2. Cada servicio Rust es independiente y se prueba con QEMU antes de integrarse.
3. Se prioriza `std` sin crates para reducir tiempo de compilación y tamaño.
4. La UI React se mantiene como capa visible, servida por el backend Rust.
5. La rama `rust-edition` es experimental; `master` sigue siendo la ISO estable.

## Componentes previstos (en orden de viabilidad)

| Componente | Función | Dependencias | Sustituye |
|---|---|---|---|
| `verdixd` | Servidor HTTP estático + `/api/health` | `std` | `server.py` |
| `verdix-pulse` | CPU/RAM/temperatura desde `/proc` | `std` | script de monitor |
| `verdix-shield` | Auditoría de permisos y archivos sensibles | `std` | chequeos ad-hoc |
| `verdix-pkg` | Gestor de paquetes/actualizaciones firmadas | `std` + `apt` externo | scripts install/update |
| `mahoraga-core` | Orquestador de tareas y eventos | `std` + IPC local | lógica Python dispersa |

## Hoja de ruta

1. Añadir toolchain Rust en el entorno de build (hoy no hay `cargo`/`rustc`).
2. Implementar `verdixd` con `TcpListener`, sirviendo `/opt/verdix/desktop` y
   un endpoint `/api/health` JSON.
3. Empaquetar el binario en el initrd y crear `verdix-rust.service`.
4. Probar con QEMU: arranque, HTTP 200 en `/desktop/`, sin regresiones.
5. Migrar `verdix-pulse` y `verdix-shield` uno por uno.
6. Documentar el proceso de compilación reproducible y crc/sha de cada binario.

## Criterio de éxito

- ISO arranca igual que `master` (BOOT OK + login serial).
- `/api/health` responde sin Python.
- El escritorio React carga con los mismos assets.
- Ningún servicio Rust supera los 20 MB de RAM residente en el objetivo.
