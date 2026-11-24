# VERDIX OS — ISO live funcional sin root

El `build.sh` original exige `live-build` y root. Cuando no hay sudo disponible,
se construye una ISO funcional modificando un live de Debian por capas:

1. Descargar `debian-live-13.8.0-amd64-xfce.iso` y extraerla con `xorriso -osirrox on`.
2. Extraer `/live/initrd.img` con `unmkinitramfs`.
3. Copiar `config/includes.chroot/` a `verdix/rootfs/` dentro del initrd.
4. Instalar `config/initramfs/50verdix` como `scripts/live-bottom/50verdix`
   (más su `ORDER`) para inyectar el rootfs en caliente durante el arranque.
5. Empaquetar con `cpio -H newc` usando `fakeroot` (UID 0), comprimir con gzip
   y concatenar el early cpio de microcódigo.
6. Reconstruir la ISO con `xorriso -as mkisofs`, preservando BIOS/UEFI e isohybrid.
7. Probar con QEMU:

```bash
~/.qemu-local/qemu-test.sh verdix-os.iso 150
python3 ~/.qemu-local/qemu_probe.py verdix-os.iso 190 'systemctl is-active verdix.service; curl -s -o /dev/null -w HTTP=%{http_code} http://127.0.0.1:8099/desktop/'
```

## Escritorio React

`desktop-react/` es una SPA estática basada en React 18 (UMD local, sin build),
servida por `server.py` en `http://127.0.0.1:8099/desktop/`. Se instala en
`/opt/verdix/desktop` y se abre automáticamente en Firefox kiosk mediante
`~/.config/autostart/verdix-desktop.desktop` del usuario `verdix`.

## Cambios aplicados al live base

- `console=ttyS0,115200` y arranque automático ISOLINUX/GRUB (pruebas QEMU).
- Usuario `verdix` (UID 1001) con sudo NOPASSWD, hostname `verdix`.
- `verdix.service` habilitado en `multi-user.target` y `graphical.target`.
- Autologin root en ttyS0 para recuperación/depuración.
- Evitar editar `/etc/group` con `sed` antes del GID (`sudo:x:verdix,27:` rompe
  `systemd-sysusers`); el formato correcto es `sudo:x:27:verdix`.
