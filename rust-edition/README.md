# VERDIX Rust Edition (experimental)

Rama experimental para migrar servicios de userspace de VERDIX a Rust sin
reescribir Linux ni modificar el ISO estable de `master`.

Arquitectura y hoja de ruta: `docs/RUST-EDITION.md`.

Regla de integración: cada componente debe pasar la prueba QEMU antes de
considerarse listo y nunca debe romper el arranque de `master`.
