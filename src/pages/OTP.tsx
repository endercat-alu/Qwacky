import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { DuckService } from '../services/DuckService'
import { useApp } from '../context/AppContext'
import { MdArrowBack } from 'react-icons/md'

const Container = styled.div`
  padding: 16px 20px;
  text-align: center;
`

const Username = styled.div`
  color: ${props => props.theme.primary};
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 16px;
`

const Message = styled.p`
  color: ${props => props.theme.text};
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  margin-bottom: 16px;
  text-align: center;
  font-size: 16px;
  
  &::placeholder {
    color: ${props => props.theme.text}80;
    font-size: 14px;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 16px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  margin-bottom: 16px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.p`
  color: ${props => props.theme.primary};
  margin-top: 8px;
  font-size: 14px;
`

interface OTPProps {
  username: string;
  onBack: () => void;
  isAddingAccount?: boolean;
  onSuccess?: () => void;
}

export const OTP = ({ username, onBack, isAddingAccount, onSuccess }: OTPProps) => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUserData, switchAccount } = useApp()
  const duckService = new DuckService()

  useEffect(() => {
    chrome.storage.local.set({ 
      loginState: 'otp',
      tempUsername: username
    });
    
    return () => {
      chrome.storage.local.remove(['otp_verification_in_progress']);
    };
  }, [username]);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    
    await chrome.storage.local.set({ otp_verification_in_progress: true });
    
    try {
      const response = await duckService.verifyOTP(username, otp);
      
      if (response.status === 'success') {
        if (isAddingAccount) {
          if (response.dashboard) {
            try {
              if (onSuccess) {
                onSuccess();
              }
              await switchAccount(username);
              await chrome.storage.local.remove(['otp_verification_in_progress']);
            } catch (error) {
              console.error('Error switching account:', error);
              setError('Failed to switch to new account');
              await chrome.storage.local.remove(['otp_verification_in_progress']);
            }
          } else {
            setError('Failed to get user data');
            await chrome.storage.local.remove(['otp_verification_in_progress']);
          }
        } else if (response.dashboard) {
          setUserData(response.dashboard);
          await chrome.storage.local.remove(['otp_verification_in_progress']);
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        setError(response.message || 'Failed to verify OTP');
        await chrome.storage.local.remove(['otp_verification_in_progress']);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      await chrome.storage.local.remove(['otp_verification_in_progress']);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.split(' ').filter(Boolean).length === 4 && !loading) {
      handleVerify()
    }
  }

  return (
    <Container>
      <BackButton onClick={onBack}>
        <MdArrowBack size={20} />
        {isAddingAccount ? 'Back to login' : 'Back'}
      </BackButton>
      
      <Username>Logged in as {username}@duck.com</Username>
      <Message>One-time passphrase sent to your email</Message>
      <Input
        type="text"
        placeholder="e.g. morality landless proved paprika"
        value={otp}
        onChange={(e) => setOtp(e.target.value.toLowerCase())}
        onKeyUp={handleKeyPress}
        disabled={loading}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
      <Button 
        onClick={handleVerify} 
        disabled={otp.split(' ').filter(Boolean).length !== 4 || loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  )
} 