import styled from 'styled-components'
import { useState } from 'react'
import { DuckService } from '../services/DuckService'
import { useApp } from '../context/AppContext'

const Container = styled.div`
  padding: 24px;
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
  color: ${props => props.theme.text};
  text-decoration: underline;
  cursor: pointer;
`

const ErrorMessage = styled.p`
  color: ${props => props.theme.primary};
  margin-top: 8px;
  font-size: 14px;
`

interface OTPProps {
  username: string;
  onBack: () => void;
}

export const OTP = ({ username, onBack }: OTPProps) => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUserData } = useApp()
  const duckService = new DuckService()

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    
    const response = await duckService.verifyOTP(username, otp)
    
    setLoading(false)
    if (response.status === 'success' && response.dashboard) {
      setUserData(response.dashboard)
    } else {
      setError(response.message)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.split(' ').filter(Boolean).length === 4 && !loading) {
      handleVerify()
    }
  }

  return (
    <Container>
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
      <BackButton onClick={onBack} disabled={loading}>
        Login using another username
      </BackButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  )
} 