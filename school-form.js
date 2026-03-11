(function() {
  var SCHOOLS_JSON_URL = 'https://cdn.jsdelivr.net/gh/ryanwalker64/techfuturesaustralisa/schools.json';

  document.addEventListener('DOMContentLoaded', function() {
    var orgSelect = document.querySelector('select[name="ORG"]');
    var schoolWrapper = document.getElementById('school-wrapper');

    if (!orgSelect || !schoolWrapper) {
      console.warn('School form: Missing required elements. Check that ORG select and #school-wrapper exist.');
      return;
    }

    // Remove any existing SCHOOL input that Webflow may have added
    var existingInput = schoolWrapper.querySelector('input[name="SCHOOL"]');
    if (existingInput) {
      existingInput.style.setProperty('display', 'none', 'important');
      existingInput.removeAttribute('name');
    }

    var tomSelectInstance = null;
    var schoolsLoaded = false;

    // Toggle school dropdown visibility based on organisation type
    orgSelect.addEventListener('change', function() {
      if (orgSelect.value === 'School') {
        schoolWrapper.classList.add('visible');
        if (!schoolsLoaded) {
          loadSchools();
        }
      } else {
        schoolWrapper.classList.remove('visible');
        if (tomSelectInstance) {
          tomSelectInstance.clear();
        }
      }
    });

    function loadSchools() {
      schoolsLoaded = true;

      // Create a <select> element for Tom Select
      var selectEl = document.createElement('select');
      selectEl.name = 'SCHOOL';
      schoolWrapper.appendChild(selectEl);

      // Add an empty default option for placeholder
      var emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      selectEl.appendChild(emptyOpt);

      fetch(SCHOOLS_JSON_URL)
        .then(function(res) { return res.json(); })
        .then(function(schools) {
          var options = schools.map(function(s) {
            var detail = '';
            if (s.suburb && s.state) {
              detail = s.suburb + ', ' + s.state;
            } else if (s.suburb) {
              detail = s.suburb;
            } else if (s.state) {
              detail = s.state;
            }

            return {
              value: detail ? s.name + ' - ' + detail : s.name,
              name: s.name,
              detail: detail
            };
          });

          tomSelectInstance = new TomSelect(selectEl, {
            options: options,
            items: [],
            valueField: 'value',
            labelField: 'value',
            searchField: ['name', 'detail'],
            maxOptions: 50,
            maxItems: 1,
            placeholder: 'Select school',
            allowEmptyOption: true,
            closeAfterSelect: true,
            plugins: ['clear_button'],
            render: {
              option: function(data, escape) {
                return '<div>' +
                  '<span>' + escape(data.name) + '</span>' +
                  (data.detail ? ' <span class="school-suburb">' + escape(data.detail) + '</span>' : '') +
                  '</div>';
              },
              item: function(data, escape) {
                return '<div>' + escape(data.value) + '</div>';
              }
            }
          });
        })
        .catch(function(err) {
          console.error('Failed to load schools:', err);
        });
    }
  });
})();
