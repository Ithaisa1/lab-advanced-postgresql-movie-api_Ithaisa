## ¿Cuándo es contraproducente crear un índice?

Crear índices ayuda mucho en las búsquedas, pero no siempre compensa. En tablas donde hay muchísimos INSERT, UPDATE o DELETE, pueden acabar ralentizando el sistema porque el índice también tiene que actualizarse cada vez. Además, en tablas pequeñas o en columnas con pocos valores distintos, como un campo activo/inactivo, PostgreSQL normalmente prefiere hacer una búsqueda secuencial porque le resulta más rápida.

## ¿Qué diferencia hay entre RANK() y DENSE_RANK()?

La diferencia principal está en cómo manejan los empates. Con RANK(), si dos elementos comparten posición, la siguiente se salta un número; por ejemplo, después de dos puestos 3 vendría un 5. En cambio, DENSE_RANK() no deja huecos y seguiría con el 4. Básicamente, RANK() refleja mejor competiciones reales y DENSE_RANK() sirve más para clasificaciones continuas.

## ¿Por qué el trigger usa AFTER INSERT OR UPDATE OR DELETE y no BEFORE?

Porque en este caso interesa guardar el resultado final de la operación, no algo previo. Con AFTER el registro ya existe en la tabla con su ID definitivo y además sabemos que la operación se realizó correctamente. Si se hiciera con BEFORE, podría darse el caso de registrar datos de una operación que luego termine fallando.
