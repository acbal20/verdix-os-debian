#!/bin/bash
# ============================================================
# VERDIX OS — Script de construcción para Debian (live-build)
# ============================================================

set -e

# Verificar que se ejecuta como root
if [ "$(id -u)" -ne 0 ]; then
    echo "Este script debe ejecutarse como root (usa sudo)"
    exit 1
fi

# Verificar que live-build está instalado
if ! command -v lb &>/dev/null; then
    echo "live-build no está instalado. Instalando..."
    apt-get update -qq
    apt-get install -y live-build debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools
fi

# Directorio de trabajo
WORK_DIR="/home/yeremy/verdix-os-debian"
ISO_OUT="/home/yeremy/verdix-out"

# Limpiar trabajos previos
rm -rf "$WORK_DIR/build" "$ISO_OUT"
mkdir -p "$ISO_OUT"

echo "============================================================"
echo "  VERDIX OS — Construcción de ISO para Debian"
echo "============================================================"
echo ""

# Entrar al directorio de configuración
cd "$WORK_DIR"

# Configurar live-build
echo "[1/5] Configurando live-build..."
lb config \
    --distribution bookworm \
    --architecture amd64 \
    --archive-areas "main contrib non-free non-free-firmware" \
    --debian-installer false \
    --bootappend-live "boot=live components quiet splash autologin username=verdix" \
    --iso-application "Verdix OS Live" \
    --iso-publisher "Verdix OS" \
    --memtest none \
    --backports false \
    --security true \
    --updates true \
    --mirror-bootstrap "http://deb.debian.org/debian/" \
    --mirror-chroot "http://deb.debian.org/debian/" \
    --mirror-chroot-security "http://security.debian.org/" \
    --mirror-binary "http://deb.debian.org/debian/" \
    --mirror-binary-security "http://security.debian.org/" \
    --firmware-binary true \
    --firmware-chroot true \
    "${@}"

echo ""
echo "[2/5] Construyendo el sistema chroot..."
lb build chroot

echo ""
echo "[3/5] Construyendo el sistema binario..."
lb build binary

echo ""
echo "[4/5] Empaquetando ISO..."
lb build iso

echo ""
echo "[5/5] Copiando ISO al directorio de salida..."
# Buscar el archivo ISO generado
ISO_FILE=$(find build -name "*.iso" -type f 2>/dev/null | head -1)
if [ -n "$ISO_FILE" ]; then
    cp "$ISO_FILE" "$ISO_OUT/verdix-os-amd64.iso"
    echo ""
    echo "============================================================"
    echo "  ¡ISO DE VERDIX OS CREADA EXITOSAMENTE!"
    echo "============================================================"
    echo ""
    echo "Ubicación: $ISO_OUT/verdix-os-amd64.iso"
    echo "Tamaño: $(du -h "$ISO_OUT/verdix-os-amd64.iso" | cut -f1)"
    echo "SHA256: $(sha256sum "$ISO_OUT/verdix-os-amd64.iso" | cut -d' ' -f1)"
    echo ""
else
    echo "ERROR: No se encontró el archivo ISO generado."
    exit 1
fi
