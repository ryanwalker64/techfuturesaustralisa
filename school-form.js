(function() {
  var SCHOOLS_JSON_URL = 'https://cdn.jsdelivr.net/gh/ryanwalker64/techfuturesaustralisa/schools.json';

  document.addEventListener('DOMContentLoaded', function() {
    var orgSelect = document.querySelector('select[name="ORG"]');
    var schoolWrapper = document.getElementById('school-wrapper');
    var schoolInput = document.querySelector('#school-wrapper input[name="SCHOOL"]');

    if (!orgSelect || !schoolWrapper || !schoolInput) {
      console.warn('School form: Missing required elements. Check that ORG select, #school-wrapper, and SCHOOL input exist.');
      return;
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

      // Create a <select> element to replace the text input
      // This gives proper single-select behavior (locks after pick)
      var selectEl = document.createElement('select');
      selectEl.name = 'SCHOOL';
      schoolInput.parentNode.insertBefore(selectEl, schoolInput);

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
            valueField: 'value',
            labelField: 'value',
            searchField: ['name', 'detail'],
            maxOptions: 50,
            placeholder: 'Select school',
            allowEmptyOption: true,
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
