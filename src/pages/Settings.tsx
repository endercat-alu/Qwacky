import { useState, useRef } from "react";
import styled from "styled-components";
import { MdFileUpload, MdArrowBack, MdDescription } from "react-icons/md";
import { FaFileCsv } from "react-icons/fa";
import { DuckService } from "../services/DuckService";
import { useApp } from "../context/AppContext";

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

const ExportButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const BackupButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  width: 100%;
`;

const BackupButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  justify-content: center;
  min-width: 0;

  &:hover {
    background-color: ${(props) => props.theme.hover};
  }

  svg {
    color: ${(props) => props.theme.primary};
    min-width: 20px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const VersionInfo = styled.div`
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: ${(props) => props.theme.textSecondary};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.primary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  margin-bottom: 16px;
`;

interface SettingsProps {
  onBack?: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const duckService = new DuckService();
  const { currentAccount } = useApp();

  const showNotification = (message: string) => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      background: #ff9f19;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 999999;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 1500);
  };

  const handleExportAddressesJSON = async () => {
    try {
      const jsonData = await duckService.exportAddresses();
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `qwacky-${currentAccount}-addresses-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      showNotification("Addresses exported to JSON successfully!");
    } catch (error) {
      showNotification("Failed to export addresses");
      console.error(error);
    }
  };

  const handleExportAddressesCSV = async () => {
    try {
      const csvData = await duckService.exportAddressesCSV();
      
      // Create a blob and download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `qwacky-${currentAccount}-addresses-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      showNotification("Addresses exported to CSV successfully!");
    } catch (error) {
      showNotification("Failed to export addresses to CSV");
      console.error(error);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportAddresses = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const result = await duckService.importAddresses(text);
      
      if (result.success) {
        setImportResult(`Imported ${result.count} new addresses`);
        showNotification(`Imported ${result.count} new addresses`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Import failed";
      setImportResult(`Error: ${errorMessage}`);
      showNotification(errorMessage);
      console.error(error);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container>
      {onBack && (
        <BackButton onClick={onBack}>
          <MdArrowBack size={20} />
          Back to Dashboard
        </BackButton>
      )}
      
      <Section>
        <SectionHeader>
          <h2>Backup & Restore</h2>
        </SectionHeader>
        
        <ExportButtonsContainer>
          <BackupButton onClick={handleExportAddressesJSON}>
            <MdDescription size={20} />
            Export as JSON
          </BackupButton>
          <BackupButton onClick={handleExportAddressesCSV}>
            <FaFileCsv size={20} />
            Export as CSV
          </BackupButton>
        </ExportButtonsContainer>
        
        <BackupButtonsContainer>
          <BackupButton onClick={handleImportClick}>
            <MdFileUpload size={20} />
            Import Addresses (JSON or CSV)
          </BackupButton>
        </BackupButtonsContainer>
        {importResult && (
          <div style={{ marginTop: '16px', fontSize: '14px' }}>
            {importResult}
          </div>
        )}
        <HiddenFileInput 
          type="file" 
          ref={fileInputRef} 
          accept=".json,.csv" 
          onChange={handleImportAddresses} 
        />
      </Section>
      
      <VersionInfo>
        Qwacky v1.1.0
      </VersionInfo>
    </Container>
  );
};