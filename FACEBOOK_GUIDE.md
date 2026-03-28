# Guía para Conexión Manual de Facebook en TECHUS

Si el botón automático de Facebook presenta problemas, puedes conectar tu página manualmente siguiendo estos pasos técnicos.

## 1. Obtener el ID de la Página
El ID de la página es un número único. Puedes encontrarlo de varias formas:
- **En Facebook**: Ve a tu Página -> Información -> Información de la página -> Desliza hasta el final para ver el "ID de la página".
- **En la URL**: Si tu URL es algo como `facebook.com/profile.php?id=123456789`, ese número es tu ID.
- **Herramientas externas**: Puedes usar sitios como `lookup-id.com` pegando la URL de tu página.

## 2. Generar un Token de Acceso de Página (Long-Lived)
Este es el paso más importante. Necesitas un token que no expire pronto.

1. Ve al [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. En **Meta App**, selecciona tu aplicación de TECHUS.
3. En **User or Page**, selecciona la opción para obtener un "Page Access Token".
4. Facebook te pedirá permisos. Asegúrate de marcar:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts` (muy importante para programar contenido)
5. Haz clic en **Generate Token**.
6. Copia el token generado y pégalo en el formulario de TECHUS.

### ¿Cómo obtener un Token de Larga Duración (60 días)?
Los tokens del Explorer suelen durar solo 1-2 horas. Para obtener uno de 60 días:
1. Ve a la herramienta de [Access Token Tool](https://developers.facebook.com/tools/accesstoken/).
2. Busca tu ID de página y haz clic en **Debug**.
3. Busca el botón que dice **Extend Access Token**.

## 3. Configuración en TECHUS
1. Entra a tu Dashboard en TECHUS.
2. Ve a la sección de **Páginas**.
3. En la tarjeta de conexión, haz clic en el icono del **engranaje** (arriba a la derecha).
4. Pega tu **ID de Página** y tu **Token de Acceso**.
5. Haz clic en **Guardar Conexión Manual**.

¡Listo! Si los datos son correctos, tu página aparecerá inmediatamente en la lista y podrás empezar a programar contenido.
