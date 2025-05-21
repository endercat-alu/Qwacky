import styled from 'styled-components';
import { MdWarning, MdInfo } from 'react-icons/md';
import { ReactNode } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const Message = styled.div`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  white-space: pre-line;
  line-height: 1.5;
`;

const ButtonContainer = styled.div<{ singleButton?: boolean }>`
  display: flex;
  justify-content: ${props => props.singleButton ? 'center' : 'flex-end'};
  gap: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; singleButton?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  ${props => {
    if (props.singleButton) {
      return `
        background: ${props.theme.primary};
        color: white;
        &:hover {
          opacity: 0.9;
        }
      `;
    }
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.primary};
        color: white;
        &:hover {
          opacity: 0.9;
        }
      `;
    }
    return `
      background: transparent;
      color: ${props.theme.text};
      &:hover {
        background: ${props.theme.hover};
      }
    `;
  }}
`;

interface ConfirmDialogProps {
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  singleButton?: boolean;
  variant?: 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  singleButton = false,
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  const Icon = variant === 'info' ? MdInfo : MdWarning;

  return (
    <Overlay onClick={(e) => {
      if (e.target === e.currentTarget && onCancel) {
        onCancel();
      }
    }}>
      <Dialog>
        <Header>
          <Icon size={24} />
          <Title>{title}</Title>
        </Header>
        <Message>{message}</Message>
        <ButtonContainer singleButton={singleButton}>
          {!singleButton && onCancel && (
            <Button 
              onClick={onCancel}
              variant="primary"
            >
              {cancelLabel}
            </Button>
          )}
          <Button 
            onClick={onConfirm}
            singleButton={singleButton}
          >
            {confirmLabel}
          </Button>
        </ButtonContainer>
      </Dialog>
    </Overlay>
  );
};