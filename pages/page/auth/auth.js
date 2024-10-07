
// 'loggedIn' is used in other parts of application. So, Don't forget to change there also
const loginExpiryKey = 'tokenExpiry'
const Userinfo = 'userinfo'

class Auth  {
  localLogin(authResult) {
    this.tokenExpiry = new Date()
    useCookie(loginExpiryKey).value= this.tokenExpiry
    useCookie('userLogin').value=true
    useCookie(Userinfo).value= authResult
  
  }

  Logout() {
    useCookie(loginExpiryKey).value= undefined
    useCookie('userLogin').value=undefined
    useCookie(Userinfo).value= undefined
  }

  isAuthenticated() {
    return (
      new Date(Date.now()) !== new Date(localStorage.getItem(loginExpiryKey)) &&
      useCookie('userLogin').value === 'true'
    )
  }
}

export default new Auth()
