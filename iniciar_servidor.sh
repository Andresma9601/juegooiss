#!/bin/bash

# Script para iniciar el servidor local del proyecto Decisiones de Vida - OISS
clear

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🎮 DECISIONES DE VIDA - OISS                       ║"
echo "║        Servidor Local                                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Iniciando servidor local..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html"
    echo "   Por favor, ejecuta este script desde el directorio del proyecto"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    echo "   Por favor, instala Python 3 para continuar"
    exit 1
fi

echo "✅ Archivos del proyecto encontrados"
echo "✅ Python 3 detectado: $(python3 --version)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Servidor iniciado en:"
echo ""
echo "   📍 URL Principal:  http://localhost:8000"
echo ""
echo "   Accesos directos:"
echo "   • Inicio/Oficina:  http://localhost:8000/games/inicio.html"
echo "   • Juego Principal: http://localhost:8000/games/index.html"
echo "   • Trivia:          http://localhost:8000/games/trivia.html"
echo "   • Parejas:         http://localhost:8000/games/parejas.html"
echo "   • Ajedrez:         http://localhost:8000/games/ajedrez.html"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Consejos:"
echo "   • Presiona Ctrl+C para detener el servidor"
echo "   • Abre http://localhost:8000 en tu navegador"
echo "   • Revisa la consola del navegador (F12) para debug"
echo "   • Usa Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows/Linux) para refrescar sin caché"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Intentar abrir el navegador automáticamente
sleep 2
if command -v open &> /dev/null; then
    echo "🌐 Abriendo navegador..."
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Abriendo navegador..."
    xdg-open http://localhost:8000
fi

echo ""
echo "📊 Logs del servidor:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar servidor
python3 -m http.server 8000
