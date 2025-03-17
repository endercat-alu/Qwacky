import { StorageService } from './StorageService';

interface Address {
  value: string;
  timestamp: number;
  notes?: string;
  username?: string;
}

export class ImportExportService {
  private storage: StorageService;
  
  constructor() {
    this.storage = new StorageService();
  }

  async exportAddresses(): Promise<string> {
    try {
      const userData = await this.storage.getUserData();
      if (!userData || !userData.user || !userData.user.username) {
        throw new Error('User data not found');
      }
      
      const username = userData.user.username;
      const addresses = await this.storage.getAddresses();

      const exportData = {
        version: '1.0',
        timestamp: Date.now(),
        account: `${username}@duck.com`,
        addresses: addresses.map((addr: Address) => ({
          value: `${addr.value}@duck.com`,
          timestamp: addr.timestamp,
          notes: addr.notes || ''
        }))
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting addresses:', error);
      throw new Error('Failed to export addresses');
    }
  }

  async exportAddressesCSV(): Promise<string> {
    try {
      const userData = await this.storage.getUserData();
      if (!userData || !userData.user || !userData.user.username) {
        throw new Error('User data not found');
      }
      
      const username = userData.user.username;
      const addresses = await this.storage.getAddresses();

      let csv = `# Export for account: ${username}@duck.com\n`;
      csv += 'Address,Timestamp,Notes\n';

      addresses.forEach((addr: Address) => {
        const timestamp = addr.timestamp;

        const notes = addr.notes ? `"${addr.notes.replace(/"/g, '""')}"` : '';
        csv += `${addr.value}@duck.com,${timestamp},${notes}\n`;
      });
      
      return csv;
    } catch (error) {
      console.error('Error exporting addresses to CSV:', error);
      throw new Error('Failed to export addresses to CSV');
    }
  }

  async importAddresses(data: string): Promise<{ success: boolean, count: number, error?: string }> {
    try {
      if (!data || typeof data !== 'string' || data.trim() === '') {
        return { success: false, count: 0, error: 'Import data is empty or invalid' };
      }

      let importedAddresses = [];

      try {

        const importData = JSON.parse(data);

        if (importData.addresses && Array.isArray(importData.addresses)) {
          importedAddresses = importData.addresses.map((addr: { value?: string, timestamp?: number, notes?: string }) => {
            if (!addr.value) {
              return null;
            }
            
            return { 
              ...addr, 
              value: addr.value.includes('@duck.com') ? addr.value.split('@')[0] : addr.value,
              timestamp: addr.timestamp || Date.now(),
              notes: addr.notes || ''
            };
          }).filter(Boolean);
        } else {
          throw new Error('Invalid JSON format: missing or invalid addresses array');
        }
      } catch (jsonError) {
        try {
          const lines = data.split('\n');
          if (lines.length <= 1) {
            throw new Error('CSV file must contain at least a header row and one data row');
          }

          let headerIndex = -1;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('#')) continue;
            if (lines[i].includes('Address') && (lines[i].includes('Created Date') || lines[i].includes('Timestamp'))) {
              headerIndex = i;
              break;
            }
          }
          
          if (headerIndex === -1) {
            throw new Error('Could not find valid CSV header row with Address and Timestamp columns');
          }
          
          for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            let parts = [];
            let inQuotes = false;
            let currentPart = '';
            
            for (let j = 0; j < line.length; j++) {
              const char = line[j];
              const nextChar = j < line.length - 1 ? line[j + 1] : '';
              
              if (char === '"') {
                if (inQuotes && nextChar === '"') {
                  currentPart += '"';
                  j++;
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                parts.push(currentPart);
                currentPart = '';
              } else {
                currentPart += char;
              }
            }
            
            parts.push(currentPart);
            
            if (parts.length >= 1) {
              const address = parts[0].trim();
              if (address) {
                const value = address.includes('@duck.com') 
                  ? address.split('@')[0] 
                  : address;

                let timestamp = Date.now();

                if (parts.length > 1 && parts[1]) {
                  const timestampStr = parts[1].trim();

                  if (/^\d+$/.test(timestampStr)) {
                    timestamp = parseInt(timestampStr, 10);
                  } else {
                    const parsedDate = new Date(timestampStr).getTime();
                    if (!isNaN(parsedDate)) {
                      timestamp = parsedDate;
                    }
                  }
                }
                const notes = parts.length > 2 ? parts[2].replace(/^"|"$/g, '') : '';
                
                importedAddresses.push({ value, timestamp, notes });
              }
            }
          }
          
          if (importedAddresses.length === 0) {
            throw new Error('No valid addresses found in the CSV file');
          }
        } catch (csvError: unknown) {
          throw new Error(`CSV parsing error: ${csvError instanceof Error ? csvError.message : 'Invalid CSV format'}`);
        }
      }

      const userData = await this.storage.getUserData();
      if (!userData || !userData.user || !userData.user.username) {
        return { success: false, count: 0, error: 'User data not found. Please log in again.' };
      }
      const username = userData.user.username;

      try {
        const currentAddresses = await this.storage.getAddresses();

        const existingAddressMap = new Map();
        currentAddresses.forEach((addr: Address) => {
          existingAddressMap.set(addr.value, true);
        });

        const newAddresses = importedAddresses.filter((addr: { value: string }) => 
          addr.value && !existingAddressMap.has(addr.value)
        );

        if (newAddresses.length === 0) {
          return { success: true, count: 0, error: 'No new addresses to import. All addresses already exist.' };
        }

        const newAddressesWithUsername = newAddresses.map((addr: any) => ({
          ...addr,
          username
        }));

        const mergedAddresses = [...newAddressesWithUsername, ...currentAddresses];

        const accountKey = `addresses_${username}`;
        await chrome.storage.local.set({ [accountKey]: mergedAddresses });

        const globalResult = await chrome.storage.local.get('generated_addresses');
        const globalAddresses = globalResult.generated_addresses || [];

        const updatedGlobalAddresses = [...newAddressesWithUsername, ...globalAddresses];
        await chrome.storage.local.set({ generated_addresses: updatedGlobalAddresses });
        
        return { 
          success: true, 
          count: newAddresses.length 
        };
      } catch (storageError: unknown) {
        return { 
          success: false, 
          count: 0, 
          error: `Storage error: ${storageError instanceof Error ? storageError.message : 'Failed to save imported addresses'}`
        };
      }
    } catch (error) {
      console.error('Error importing addresses:', error);
      return { 
        success: false, 
        count: 0, 
        error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
} 