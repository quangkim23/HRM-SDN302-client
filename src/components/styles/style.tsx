export const selectStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      height: '36px',
      minHeight: '36px',
      borderRadius: '0.375rem',
      borderColor: 'var(--border-input, #e5e7eb)',
      padding: '0',
      fontSize: '0.8125rem',
      backgroundColor: 'transparent',
      ':hover': {
        borderColor: 'var(--border-input-hover, #d1d5db)'
      },
      ':focus-within': {
        borderColor: 'var(--primary, #3b82f6)',
        boxShadow: '0 0 0 1px var(--primary, #3b82f6)'
      },
      paddingLeft: '2.25rem'
    }),
    option: (baseStyles: any, { isFocused, isSelected }: { isFocused: boolean, isSelected: boolean }) => ({
      ...baseStyles,
      backgroundColor: isSelected
        ? 'hsl(var(--primary))' // Sử dụng giá trị mã hex thay vì biến CSS
        : isFocused
          ? 'rgba(59, 130, 246, 0.1)'
          : 'transparent',
      color: isSelected ? 'white' : 'inherit',
      cursor: 'pointer',
      padding: '6px 12px',
      fontSize: '0.8125rem',
      ':hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: 'inherit'
      }
    }),
    menu: (baseStyles: any) => ({
      ...baseStyles,
      zIndex: 50
    }),
    valueContainer: (baseStyles: any) => ({
      ...baseStyles,
      padding: '0 8px'
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      fontSize: '0.8125rem',
      color: 'var(--text-muted, #6b7280)'
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      fontSize: '0.8125rem' 
    }),
    indicatorsContainer: (baseStyles: any) => ({
      ...baseStyles,
      height: '36px'
    }),
    dropdownIndicator: (baseStyles: any) => ({
      ...baseStyles,
      padding: '6px'
    }),
    clearIndicator: (baseStyles: any) => ({
      ...baseStyles,
      padding: '6px'
    })
  };