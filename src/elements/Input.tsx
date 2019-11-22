import React, { forwardRef } from 'react'
import styled from '../theme/styled'

interface IProps {
  id?: string
  className?: string
  value?: string | number
  type?: 'email' | 'password' | 'text' | 'number' | 'textarea'
  autocomplete?: string
  color?: string
  icon?: React.ReactNode
  hasError?: boolean
  paddingLeft?: string
  fullWidth?: boolean
  disabled?: boolean
  placeholder?: string
  required?: boolean
  onChange: (value: any) => void // Basically one of: string | number | file
  onFocus?: () => void
  onBlur?: () => void
  onKeyPress?: (e: React.KeyboardEvent) => void
}

const InputEl = forwardRef((props: IProps, ref: React.Ref<any>) => {
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    !disabled && props.onChange!(event.target.value)
  }
  const {
    className, id, value, type, icon, placeholder, disabled, required,
    autocomplete,
    onKeyPress, onFocus, onBlur, fullWidth, paddingLeft, hasError
  } = props
  return (
    <Container className={className} fullWidth={fullWidth}>
      { icon }
      { type === 'textarea' ?
        <StyledTextarea
          id={id}
          ref={ref}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          hasError={hasError}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        :
      <StyledInput
        id={id}
        ref={ref}
        value={value}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autocomplete}
        paddingLeft={paddingLeft}
        hasError={hasError}
        onChange={handleChange}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      }
    </Container>
  )
})

InputEl.defaultProps = {
  required: false,
  type: 'text',
  disabled: false,
}

type ContainerProps = { fullWidth?: boolean }
const Container = styled.div<ContainerProps>`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.textDark };
  border-radius: 4px;
  display: flex;
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : '180px' };
  &:focus {
    background-image: linear-gradient(to right, #cefff8, #729EE74D);
    color: ${({ theme }) => theme.color.textDark };
    outline: auto 5px;
  }
  & > svg {
    left: 8px;
    position: absolute;
  }
`
interface ITextareaProps { hasError?: boolean }
const StyledTextarea = styled.textarea<ITextareaProps>`
  border: 0;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.medium };
  height: 100%;
  min-height: 100px;
  padding: 0.5rem;
  width: 100%;
`
const StyledInput = styled.input<IProps>`
  background-color: ${({ theme }) => theme.color.white };
  border: 0;
  border-radius: 4px;
  color: ${({ theme }) => theme.color.textDark };
  font-size: ${({ theme }) => theme.fontSize.medium };
  padding: 0.5rem 0.5rem;
  padding-left: ${({ paddingLeft }) => paddingLeft || ''};
  text-decoration: none;
  transition: 0.1s all;
  width: 100%;
  &:focus {
    background-image: linear-gradient(to right,#fcffff,#e6f8ff4d);
    color: ${({ theme }) => theme.color.textDark };
  }
`
export const Input = styled(InputEl)``
