import { AuthService } from './AuthService'
import { LoginResponse, VerifyResponse, GenerateResponse, UserData } from '../types'

export class DuckService {
  private auth: AuthService
  
  constructor() {
    this.auth = new AuthService()
  }

  async login(username: string): Promise<LoginResponse> {
    const response = await this.auth.requestOTP(username)
    return response
  }

  async verifyOTP(username: string, otp: string): Promise<VerifyResponse> {
    const response = await this.auth.verifyOTP(username, otp)
    if (response.status === 'success') {
      await this.saveUserData(response)
    }
    return response
  }

  async generateAddress(): Promise<GenerateResponse> {
    try {
      const userData = await this.getUserData()
      if (!userData) {
        return { status: 'error', message: 'You need to login first' }
      }
      
      const response = await this.auth.generateAddress(userData.user.access_token)
      if (response.status === 'success') {
        await this.saveGeneratedAddress(response.address!)
        await this.updateAddressCount(userData.stats.addresses_generated + 1)
      }
      return response
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getUserData(): Promise<UserData | null> {
    const result = await chrome.storage.local.get('user_data')
    return result.user_data || null
  }

  async logout(): Promise<void> {
    await chrome.storage.local.clear()
  }

  private async saveUserData(data: VerifyResponse) {
    await chrome.storage.local.set({
      access_token: data.access_token,
      user_data: data.dashboard
    })
  }

  private async saveGeneratedAddress(address: string) {
    const result = await chrome.storage.local.get('generated_addresses')
    const addresses = result.generated_addresses || []
    await chrome.storage.local.set({
      generated_addresses: [{
        value: address,
        timestamp: Date.now()
      }, ...addresses]
    })
  }

  private async updateAddressCount(count: number) {
    const userData = await this.getUserData()
    if (userData) {
      userData.stats.addresses_generated = count
      await chrome.storage.local.set({ user_data: userData })
    }
  }
} 