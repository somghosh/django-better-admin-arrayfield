// I am to lazy to add js transpiler and compressor to this. just use https://jscompress.com

window.addEventListener('load', function () {
    let item_count = 1;

    function addRemoveEventListener(widgetElement) {
        widgetElement.querySelectorAll('.remove').forEach(element => {
            element.addEventListener('click', () => {
                element.parentNode.remove();
            });
        });
    }

    function initializeWidget(widgetElement) {
        const initialElement = widgetElement.querySelector('.array-item');
        const elementTemplate = initialElement.cloneNode(true);
        const parentElement = initialElement.parentElement;

        if (initialElement.getAttribute('data-isNone')) {
            initialElement.remove();
            elementTemplate.removeAttribute('data-isNone');
            elementTemplate.removeAttribute('style');
        }
        addRemoveEventListener(widgetElement);

        widgetElement.querySelector('.add-array-item').addEventListener('click', () => {
            item_count++;
            const newElementContainer = elementTemplate.cloneNode(true);
            const newElementControl = newElementContainer.querySelectorAll('input, textarea, select')[0]
            if(!newElementControl){
                console.warn('Django better admin array field - can\' find correct form element ' +
                    '- expect input or textarea as custom widget implementation')
                return
            }
            const id_parts = newElementControl.getAttribute('id').split('_');
            const id = id_parts.slice(0, -1).join('_') + '_' + String(item_count - 1);
            newElementControl.setAttribute('id', id);
            newElementControl.value = '';

            addRemoveEventListener(newElementContainer);
            parentElement.appendChild(newElementContainer);
        });
    }

    django.jQuery(".dynamic-array-widget").not(".empty-form .dynamic-array-widget").each(
        (index, widgetElement) => initializeWidget(widgetElement)
    );

    django.jQuery(document).on('formset:added', function(event, $row, formsetName) {
        $row[0].querySelectorAll(".dynamic-array-widget").forEach(
            widgetElement => initializeWidget(widgetElement)
        );
    });
  });
