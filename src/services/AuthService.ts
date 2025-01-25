export class AuthService {
  private headers: Record<string, string>

  constructor() {
    this.headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
    }
  }

  async requestOTP(username: string) {
    try {
      const response = await fetch(
        `https://quack.duckduckgo.com/api/auth/loginlink?user=${username}`,
        { headers: this.headers }
      )
      if (response.ok) {
        return { status: 'success', needs_otp: true, message: 'OTP sent to your email!' }
      }
      throw new Error('Failed to send OTP')
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async verifyOTP(username: string, otp: string) {
    try {
      const loginResponse = await fetch(
        `https://quack.duckduckgo.com/api/auth/login?otp=${otp}&user=${username}`,
        { headers: this.headers }
      )
      const loginData = await loginResponse.json()
      
      if ('token' in loginData) {
        const headers = { ...this.headers, authorization: `Bearer ${loginData.token}` }
        const dashboardResponse = await fetch(
          'https://quack.duckduckgo.com/api/email/dashboard',
          { headers }
        )
        const dashboardData = await dashboardResponse.json()
        
        return {
          status: 'success',
          dashboard: dashboardData,
          access_token: loginData.token,
          message: 'Login successful!'
        }
      }
      
      return { status: 'error', message: 'Invalid OTP' }
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async generateAddress(token: string) {
    try {
      const headers = { 
        ...this.headers, 
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json'
      }
      
      const response = await fetch(
        'https://quack.duckduckgo.com/api/email/addresses',
        { 
          method: 'POST',
          headers
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to generate address')
      }
      
      const data = await response.json()
      if (data.address) {
        return { 
          status: 'success', 
          address: data.address 
        }
      }
      throw new Error('Invalid response format')
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
} 