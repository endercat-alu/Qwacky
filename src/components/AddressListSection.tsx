import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { MdVisibility, MdVisibilityOff, MdEdit, MdCheck, MdClose, MdDelete } from "react-icons/md";

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    font-size: 18px;
    margin: 0;
  }
`;

const AddressList = styled.div<{ hidden?: boolean }>`
  background: ${(props) => props.theme.surface};
  border-radius: 8px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;

  .address {
    font-weight: 500;
    word-break: break-all;
  }

  .time {
    color: ${(props) => props.theme.textSecondary};
    font-size: 12px;
    white-space: nowrap;
    margin-left: 8px;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  padding: 4px;

  svg {
    width: 24px;
    height: 24px;
  }
  
  &.delete {
    color: #e53935;
    
    &:hover {
      color: #c62828;
    }
  }
`;

const AddressItem = styled.div`
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 12px 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const NotesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
`;

const Notes = styled.div`
  color: ${props => props.theme.textSecondary};
  flex: 1;
`;

const EmptyNotes = styled.div`
  color: ${props => props.theme.textTertiary};
  font-style: italic;
  flex: 1;
`;

const NotesEditContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const NotesInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const NotesActions = styled.div`
  display: flex;
  gap: 4px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

interface StoredAddress {
  value: string;
  timestamp: number;
  notes?: string;
}

interface EditingState {
  addressValue: string;
  notes: string;
}

interface AddressListSectionProps {
  addresses: StoredAddress[];
  copyToClipboard: (text: string, event?: MouseEvent) => void;
  formatTime: (timestamp: number) => string;
  onUpdateNotes: (addressValue: string, notes: string) => Promise<void>;
  onDeleteAddress: (addressValue: string) => Promise<void>;
}

export const AddressListSection: React.FC<AddressListSectionProps> = ({
  addresses,
  copyToClipboard,
  formatTime,
  onUpdateNotes,
  onDeleteAddress
}) => {
  const [hideAddresses, setHideAddresses] = useState(false);
  const [editing, setEditing] = useState<EditingState | null>(null);

  const handleEditNotes = useCallback((address: StoredAddress) => {
    setEditing({
      addressValue: address.value,
      notes: address.notes || ''
    });
  }, []);

  const handleSaveNotes = useCallback(async () => {
    if (!editing) return;
    
    await onUpdateNotes(editing.addressValue, editing.notes);
    setEditing(null);
  }, [editing, onUpdateNotes]);

  const handleCancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const handleDeleteAddress = useCallback(async (addressValue: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await onDeleteAddress(addressValue);
    }
  }, [onDeleteAddress]);

  const toggleHideAddresses = useCallback(() => {
    setHideAddresses(prev => !prev);
  }, []);

  const addressList = useMemo(() => {
    if (addresses.length === 0) {
      return (
        <p>No addresses generated yet. Click the button above to generate your first address.</p>
      );
    }

    return (
      <AddressList 
        hidden={hideAddresses} 
        role="list" 
        aria-label="Generated email addresses"
      >
        {addresses.map((address, index) => (
          <AddressItem 
            key={`${address.value}-${index}`} 
            role="listitem"
          >
            <AddressHeader 
              onClick={(e) => copyToClipboard(address.value + "@duck.com", e.nativeEvent)}
              role="button"
              aria-label={`Copy ${address.value}@duck.com to clipboard`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyToClipboard(address.value + "@duck.com", e.nativeEvent as unknown as MouseEvent);
                }
              }}
            >
              <span className="address">{address.value}@duck.com</span>
              <span className="time">{formatTime(address.timestamp)}</span>
            </AddressHeader>
            
            {editing && editing.addressValue === address.value ? (
              <NotesEditContainer>
                <NotesInput 
                  value={editing.notes}
                  onChange={(e) => setEditing({...editing, notes: e.target.value})}
                  placeholder="Add notes for this address..."
                  aria-label="Edit notes for this address"
                />
                <NotesActions>
                  <IconButton 
                    onClick={handleSaveNotes}
                    aria-label="Save notes"
                  >
                    <MdCheck size={18} />
                  </IconButton>
                  <IconButton 
                    onClick={handleCancelEdit}
                    aria-label="Cancel editing"
                  >
                    <MdClose size={18} />
                  </IconButton>
                </NotesActions>
              </NotesEditContainer>
            ) : (
              <NotesContainer>
                {address.notes ? (
                  <Notes>{address.notes}</Notes>
                ) : (
                  <EmptyNotes>No notes</EmptyNotes>
                )}
                <ButtonsContainer>
                  <IconButton 
                    onClick={() => handleEditNotes(address)}
                    aria-label="Edit notes"
                  >
                    <MdEdit size={18} />
                  </IconButton>
                  <IconButton 
                    className="delete" 
                    onClick={() => handleDeleteAddress(address.value)}
                    aria-label="Delete address"
                  >
                    <MdDelete size={18} />
                  </IconButton>
                </ButtonsContainer>
              </NotesContainer>
            )}
          </AddressItem>
        ))}
      </AddressList>
    );
  }, [addresses, hideAddresses, editing, copyToClipboard, formatTime, handleEditNotes, handleSaveNotes, handleCancelEdit, handleDeleteAddress]);

  return (
    <Section>
      <SectionHeader>
        <h2 id="addresses-heading">Generated Addresses</h2>
        <IconButton 
          onClick={toggleHideAddresses}
          aria-label={hideAddresses ? "Show addresses" : "Hide addresses"}
          aria-expanded={!hideAddresses}
          aria-controls="addresses-list"
        >
          {hideAddresses ? <MdVisibility /> : <MdVisibilityOff />}
        </IconButton>
      </SectionHeader>
      <div id="addresses-list" aria-labelledby="addresses-heading">
        {addressList}
      </div>
    </Section>
  );
}; 