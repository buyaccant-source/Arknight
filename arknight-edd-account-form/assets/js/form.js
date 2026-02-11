(function () {
  const forms = document.querySelectorAll('.arkn-account-form');

  const setError = (form, message, field) => {
    const feedback = form.querySelector('.arkn-form-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('is-error');
    }

    if (field) {
      field.classList.add('arkn-invalid');
      field.focus();
    }
  };

  const clearError = (form) => {
    const feedback = form.querySelector('.arkn-form-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('is-error');
    }
    form.querySelectorAll('.arkn-invalid').forEach((el) => el.classList.remove('arkn-invalid'));
  };


  const initCheckboxCards = (form) => {
    form.querySelectorAll('.arkn-card input[type="checkbox"]').forEach((checkbox) => {
      const card = checkbox.closest('.arkn-card');
      if (!card) return;

      const applyState = () => card.classList.toggle('is-selected', checkbox.checked);
      applyState();
      checkbox.addEventListener('change', applyState);
    });
  };

  const initCustomSelect = (form) => {
    form.querySelectorAll('[data-select-wrap]').forEach((wrap) => {
      const trigger = wrap.querySelector('[data-select-trigger]');
      const menu = wrap.querySelector('[data-select-menu]');
      const label = wrap.querySelector('[data-select-label]');
      const select = wrap.querySelector('select');

      if (!trigger || !menu || !label || !select) return;

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        menu.hidden = isOpen;
      });

      menu.querySelectorAll('[data-option]').forEach((optionBtn) => {
        optionBtn.addEventListener('click', () => {
          const value = optionBtn.getAttribute('data-option') || '';
          select.value = value;
          label.textContent = optionBtn.textContent || 'انتخاب کنید';
          trigger.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
        });
      });

      document.addEventListener('click', (event) => {
        if (!wrap.contains(event.target)) {
          trigger.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
        }
      });
    });
  };

  forms.forEach((form) => {
    initCheckboxCards(form);
    initCustomSelect(form);

    form.addEventListener('submit', (event) => {
      clearError(form);

      const requiredFields = form.querySelectorAll('[required]');
      for (const field of requiredFields) {
        if (!field.value || String(field.value).trim() === '') {
          event.preventDefault();
          setError(form, field.getAttribute('data-error') || 'لطفاً این فیلد را تکمیل کنید.', field);
          return;
        }

        if (field.type === 'number') {
          const value = Number(field.value);
          const min = Number(field.getAttribute('min'));
          const max = Number(field.getAttribute('max'));
          if (Number.isNaN(value) || value < min || value > max) {
            event.preventDefault();
            setError(form, field.getAttribute('data-error') || 'مقدار وارد شده معتبر نیست.', field);
            return;
          }
        }
      }

      const submitButton = form.querySelector('.arkn-submit');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('is-loading');
        submitButton.textContent = 'در حال ارسال...';
      }
    });
  });
})();
