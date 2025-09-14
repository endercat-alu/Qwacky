import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { MdVisibility, MdVisibilityOff, MdEdit, MdCheck, MdClose, MdDelete, MdDeleteSweep } from "react-icons/md";
import { ConfirmDialog } from './ConfirmDialog';
import { useI18n } from '../i18n/I18nContext';

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

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
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

  &.clear {
    color: #e53935;
    
    &:hover {
      color: #c62828;
    }
  }

  &.auto {
    background-color: ${(props) => props.theme.primary};
    color: white;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    
    &:hover {
      background-color: ${(props) => props.theme.primary}dd;
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
  onClearAllAddresses: () => Promise<void>;
}

export const AddressListSection: React.FC<AddressListSectionProps> = ({
  addresses,
  copyToClipboard,
  formatTime,
  onUpdateNotes,
  onDeleteAddress,
  onClearAllAddresses
}) => {
  const [hideAddresses, setHideAddresses] = useState(false);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { t } = useI18n();

  const handleEditNotes = useCallback((address: StoredAddress) => {
    setEditing({
      addressValue: address.value,
      notes: address.notes || ''
    });
  }, []);

  const handleAutoFillNotes = useCallback(async () => {
    if (!editing) return;
    
    try {
      // Get current tab URL from background script
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentTabDomain' });
      if (response && response.domain) {
        setEditing({
          ...editing,
          notes: response.domain
        });
      }
    } catch (error) {
      console.error('Error getting current tab domain:', error);
    }
  }, [editing]);

  const handleSaveNotes = useCallback(async () => {
    if (!editing) return;
    
    await onUpdateNotes(editing.addressValue, editing.notes);
    setEditing(null);
  }, [editing, onUpdateNotes]);

  const handleCancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const handleDeleteClick = useCallback((addressValue: string) => {
    setDeleteConfirm(addressValue);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteConfirm) {
      await onDeleteAddress(deleteConfirm);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, onDeleteAddress]);

  const handleClearConfirm = useCallback(async () => {
    await onClearAllAddresses();
    setShowClearConfirm(false);
  }, [onClearAllAddresses]);

  const toggleHideAddresses = useCallback(() => {
    setHideAddresses(prev => !prev);
  }, []);

  const addressList = useMemo(() => {
    if (addresses.length === 0) {
      return (
        <p>{t('dashboard.addresses.empty')}</p>
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
                  placeholder={t('dashboard.addresses.notes.placeholder')}
                  aria-label={t('dashboard.addresses.notes.placeholder')}
                />
                <NotesActions>
                  <IconButton
                    className="auto"
                    onClick={handleAutoFillNotes}
                    aria-label={t('common.auto')}
                  >
                    <span>A</span>
                  </IconButton>
                  <IconButton
                    onClick={handleSaveNotes}
                    aria-label={t('common.save')}
                  >
                    <MdCheck size={18} />
                  </IconButton>
                  <IconButton
                    onClick={handleCancelEdit}
                    aria-label={t('common.cancel')}
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
                  <EmptyNotes>{t('dashboard.addresses.notes.empty')}</EmptyNotes>
                )}
                <ButtonsContainer>
                  <IconButton 
                    onClick={() => handleEditNotes(address)}
                    aria-label={t('common.edit')}
                  >
                    <MdEdit size={18} />
                  </IconButton>
                  <IconButton 
                    className="delete" 
                    onClick={() => handleDeleteClick(address.value)}
                    aria-label={t('common.delete')}
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
  }, [addresses, hideAddresses, editing, copyToClipboard, formatTime, handleEditNotes, handleSaveNotes, handleCancelEdit, handleDeleteClick, t]);

  return (
    <>
      <Section>
        <SectionHeader>
          <h2 id="addresses-heading">{t('dashboard.addresses.title')}</h2>
          <HeaderActions>
            {addresses.length > 0 && (
              <IconButton 
                className="clear"
                onClick={() => setShowClearConfirm(true)}
                aria-label={t('dashboard.addresses.clearAll')}
              >
                <MdDeleteSweep size={24} />
              </IconButton>
            )}
            <IconButton 
              onClick={toggleHideAddresses}
              aria-label={hideAddresses ? t('dashboard.addresses.show') : t('dashboard.addresses.hide')}
              aria-expanded={!hideAddresses}
              aria-controls="addresses-list"
            >
              {hideAddresses ? <MdVisibility /> : <MdVisibilityOff />}
            </IconButton>
          </HeaderActions>
        </SectionHeader>
        <div id="addresses-list" aria-labelledby="addresses-heading">
          {addressList}
        </div>
      </Section>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title={t('dashboard.addresses.deleteConfirm.title')}
        message={`${t('dashboard.addresses.deleteConfirm.message')}\n(${deleteConfirm}@duck.com)?`}
        confirmLabel={t('dashboard.addresses.deleteConfirm.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        title={t('dashboard.addresses.clearConfirm.title')}
        message={t('dashboard.addresses.clearConfirm.message')}
        confirmLabel={t('dashboard.addresses.clearConfirm.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  );
};