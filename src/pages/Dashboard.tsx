import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useApp } from "../context/AppContext";
import { DuckService } from "../services/DuckService";

const Container = styled.div`
  padding: 16px 20px;
`;

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

const InfoItem = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
    color: ${(props) => props.theme.text}80;

    &.highlight {
      color: ${(props) => props.theme.primary};
    }
  }

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: color 0.2s;
    font-size: 14px;

    &:hover {
      opacity: 0.8;
    }
  }
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

const InfoValue = styled.span<{ hidden?: boolean }>`
  flex: 1;
  display: ${(props) => (props.hidden ? "none" : "block")};
`;

const AddressList = styled.div<{ hidden?: boolean }>`
  background: ${(props) => props.theme.surface};
  border-radius: 8px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid ${(props) => props.theme.border};
    cursor: pointer;
    transition: color 0.2s;
    font-size: 14px;
    gap: 12px;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      color: ${(props) => props.theme.primary};
    }

    span.address {
      flex: 1;
      display: ${(props) => (props.hidden ? "none" : "block")};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span.time {
      font-size: 12px;
      color: ${(props) => props.theme.text}80;
      white-space: nowrap;
    }
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
`;

interface StoredAddress {
  value: string;
  timestamp: number;
}

export const Dashboard = () => {
  const { userData } = useApp();
  const [hideAddresses, setHideAddresses] = useState(false);
  const [hideUserInfo, setHideUserInfo] = useState(false);
  const [addresses, setAddresses] = useState<StoredAddress[]>([]);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const duckService = new DuckService();

  useEffect(() => {
    if (userData) {
      setAddressesCount(userData.stats.addresses_generated);
      chrome.storage.local.get("generated_addresses", (result) => {
        setAddresses(result.generated_addresses || []);
      });
    }
  }, [userData]);

  const showNotification = (message: string, event?: MouseEvent) => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      background: #ff9f19;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 999999;
      font-size: 14px;
    `;
    notification.textContent = message;

    if (event) {
      // Position near cursor
      notification.style.left = `${event.clientX + 10}px`;
      notification.style.top = `${event.clientY + 10}px`;
    } else {
      // Fallback to center position
      notification.style.top = "50%";
      notification.style.left = "50%";
      notification.style.transform = "translate(-50%, -50%)";
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 1500);
  };

  const copyToClipboard = (text: string, event?: MouseEvent) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied!", event);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const generateNewAddress = async () => {
    setLoading(true);
    const response = await duckService.generateAddress();
    setLoading(false);

    if (response.status === "success" && response.address) {
      const newAddress = {
        value: response.address,
        timestamp: Date.now(),
      };
      setAddresses([newAddress, ...addresses]);
      setAddressesCount((prev) => prev + 1);
      copyToClipboard(response.address + "@duck.com");
    }
  };

  const maskText = (text: string) => "*".repeat(text.length);

  if (!userData) return null;

  return (
    <Container>
      <Section>
        <SectionHeader>
          <h2>User Information</h2>
          <IconButton onClick={() => setHideUserInfo(!hideUserInfo)}>{hideUserInfo ? <MdVisibility /> : <MdVisibilityOff />}</IconButton>
        </SectionHeader>
        <>
          <InfoItem>
            <label className="highlight">Duck Username</label>
            <div onClick={(e) => copyToClipboard(`${userData.user.username}@duck.com`, e.nativeEvent)}>
              <InfoValue>{hideUserInfo ? maskText(`${userData.user.username}@duck.com`) : `${userData.user.username}@duck.com`}</InfoValue>
            </div>
          </InfoItem>
          <InfoItem>
            <label className="highlight">Forwarding Email</label>
            <div onClick={(e) => copyToClipboard(userData.user.email, e.nativeEvent)}>
              <InfoValue>{hideUserInfo ? maskText(userData.user.email) : userData.user.email}</InfoValue>
            </div>
          </InfoItem>
          <InfoItem>
            <label className="highlight">Total Generated Address</label>
            <div>
              <span>{addressesCount}</span>
            </div>
          </InfoItem>
          {userData.invites.length > 0 && (
            <InfoItem>
              <label>Invites</label>
              <span>{userData.invites.length}</span>
            </InfoItem>
          )}
        </>
      </Section>

      <Button onClick={generateNewAddress} disabled={loading}>
        {loading ? "Generating..." : "Generate New Address"}
      </Button>

      <Section>
        <SectionHeader>
          <h2>Generated Addresses</h2>
          <IconButton onClick={() => setHideAddresses(!hideAddresses)}>{hideAddresses ? <MdVisibility /> : <MdVisibilityOff />}</IconButton>
        </SectionHeader>
        {addresses.length > 0 && (
          <AddressList hidden={hideAddresses}>
            {addresses.map((address, index) => (
              <div key={index} onClick={(e) => copyToClipboard(address.value + "@duck.com", e.nativeEvent)}>
                <span className="address">{address.value}@duck.com</span>
                <span className="time">{formatTime(address.timestamp)}</span>
              </div>
            ))}
          </AddressList>
        )}
      </Section>
    </Container>
  );
};
