# VERDIX OS — Debian Live Build

ISO de Verdix OS basada en Debian, compilada con `live-build`.

## Estructura

```
/home/yeremy/verdix-os-debian/
├── build.sh                  # Script de construcción
├── config/
│   ├── package-lists.chroot/
│   │   └── verdix.list.chroot    # Paquetes de Debian a instalar
│   ├── hooks.chroot/
│   │   └── 01-verdix-setup.chroot # Script de configuración post-instalación
│   ├── includes.chroot/
│   │   ├── etc/systemd/system/verdix.service    # Servicio web de Verdix
│   │   ├── etc/lightdm/lightdm.conf             # Autologin LightDM
│   │   ├── etc/xdg/xfce4/helpers.rc             # Navegador predeterminado
│   │   └── opt/verdix/                          # Aplicación web de Verdix
│   │       ├── browser.html      ← Navegador predeterminado
│   │       ├── search.html       ← Buscador predeterminado
│   │       ├── ai.html           ← IA mejorada
│   │       ├── index.html
│   │       ├── server.py         ← Servidor web
│   │       └── juego/            ← Juego Ben 10 integrado
│   ├── binary/
│   │   ├── iso                   # Configuración de la ISO
│   │   └── bootloaders           # Cargadores de arranque (GRUB)
│   └── apt/
│       └── source.list           # Repositorios de Debian
└── README.md
```

## Cómo compilar la ISO en Debian

### 1. Instalar dependencias
```bash
sudo apt-get update
sudo apt-get install -y live-build debootstrap squashfs-tools \
    xorriso grub-pc-bin grub-efi-amd64-bin mtools
```

### 2. Ejecutar la construcción
```bash
cd /home/yeremy/verdix-os-debian
sudo ./build.sh
```

### 3. Resultado
La ISO se generará en:
```
/home/yeremy/verdix-out/verdix-os-amd64.iso
```

Tamaño aproximado: 1.5 - 2.0 GB

## ¿Qué incluye Verdix OS?

- **Entorno de escritorio:** XFCE 4
- **Gestor de sesiones:** LightDM con autologin (usuario: verdix)
- **Navegador predeterminado:** Firefox ESR (con Verdix Browser como página de inicio)
- **Buscador predeterminado:** Verdix Search
- **IA:** Verdix AI (conectada a OpenRouter con fallback a Qwen)
- **Servidor web:** Python + servidor en `/opt/verdix/server.py` (puerto 8099)
- **Juego:** Ben 10 Omnitrix Battle integrado en `http://localhost:8099/juego/`
- **Usuario por defecto:** verdix / verdix (UID 1000, sudo sin contraseña)

## Credenciales

| Usuario | Contraseña | Notas |
|---------|-----------|-------|
| verdix | verdix | Usuario principal, sudo sin contraseña |
| root | (sin contraseña) | Acceso directo con sudo |

## Servicios

- **verdix.service:** Servidor web de Verdix (puerto 8099)
- **LightDM:** Gestor de sesiones con autologin
- **NetworkManager:** Gestión de red
