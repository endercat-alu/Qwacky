import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useApp } from "../context/AppContext";
import { DuckService } from "../services/DuckService";
import { useNotification } from "../components/Notification";
import { UserInfoSection } from "../components/UserInfoSection";
import { AddressListSection } from "../components/AddressListSection";
import { useI18n } from "../i18n/I18nContext";

const Container = styled.div`
  padding: 16px 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 24px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

interface StoredAddress {
  value: string;
  timestamp: number;
  notes?: string;
}

export const Dashboard = () => {
  const { userData, currentAccount } = useApp();
  const [addresses, setAddresses] = useState<StoredAddress[]>([]);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const duckService = new DuckService();
  const { showNotification, NotificationRenderer } = useNotification();
  const { t } = useI18n();

  useEffect(() => {
    if (userData) {
      setAddressesCount(userData.stats.addresses_generated);
      
      const loadAddresses = async () => {
        try {
          const addresses = await duckService.getAddresses();
          setAddresses(addresses);
        } catch (error) {
          console.error('Error loading addresses:', error);
          setAddresses([]);
        }
      };
      
      loadAddresses();
    } else {
      setAddresses([]);
    }
  }, [userData, currentAccount]);

  const copyToClipboard = useCallback((text: string, event?: MouseEvent) => {
    navigator.clipboard.writeText(text);
    showNotification(t('common.copied'), event);
  }, [showNotification]);

  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  }, []);

  const generateNewAddress = async () => {
    setLoading(true);
    try {
      const response = await duckService.generateAddress();
      
      if (response.status === "success" && response.address) {
        const newAddress = {
          value: response.address,
          timestamp: Date.now(),
          notes: ''
        };
        setAddresses([newAddress, ...addresses]);
        
        setAddressesCount((prev) => prev + 1);
        
        const refreshedUserData = await duckService.getUserData();
        if (refreshedUserData && refreshedUserData.stats) {
          setAddressesCount(refreshedUserData.stats.addresses_generated);
        }
        
        copyToClipboard(response.address + "@duck.com");
        showNotification(t('notification.addressGenerated'));
      } else {
        showNotification(t('notification.error') + ": " + (response.message || t('notification.error')));
      }
    } catch (error) {
      console.error("Error generating address:", error);
      showNotification(t('notification.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async (addressValue: string, notes: string) => {
    try {
      const success = await duckService.updateAddressNotes(addressValue, notes);
      
      if (success) {
        setAddresses(addresses.map(addr => 
          addr.value === addressValue 
            ? { ...addr, notes } 
            : addr
        ));
        showNotification(t('notification.notesUpdated'));
      } else {
        showNotification(t('notification.notesFailed'));
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      showNotification(t('notification.error'));
    }
  };

  const handleDeleteAddress = async (addressValue: string) => {
    try {
      const success = await duckService.deleteAddress(addressValue);
      
      if (success) {
        setAddresses(addresses.filter(addr => addr.value !== addressValue));
        showNotification(t('notification.addressDeleted'));
      } else {
        showNotification(t('notification.deleteFailed'));
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showNotification(t('notification.error'));
    }
  };

  const handleClearAllAddresses = async () => {
    try {
      const success = await duckService.clearAllAddresses();
      
      if (success) {
        setAddresses([]);
        setAddressesCount(0);
        showNotification(t('notification.addressClear'));
      } else {
        showNotification(t('notification.clearFailed'));
      }
    } catch (error) {
      console.error("Error clearing addresses:", error);
      showNotification(t('notification.error'));
    }
  };

  if (!userData) return null;

  return (
    <Container>
      <UserInfoSection 
        userData={userData}
        addressesCount={addressesCount}
        copyToClipboard={copyToClipboard}
      />
      <Button onClick={generateNewAddress} disabled={loading}>
        {loading ? t('dashboard.addresses.generating') : t('dashboard.addresses.generateButton')}
      </Button>
      <AddressListSection 
        addresses={addresses}
        copyToClipboard={copyToClipboard}
        formatTime={formatTime}
        onUpdateNotes={handleUpdateNotes}
        onDeleteAddress={handleDeleteAddress}
        onClearAllAddresses={handleClearAllAddresses}
      />
      <NotificationRenderer />
    </Container>
  );
};
