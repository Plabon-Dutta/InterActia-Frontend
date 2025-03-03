import { quick_contact } from './../model/quick-contact.type';
import { SharedService } from './../shared.service';
import { Component, ElementRef, ViewChild, OnInit, HostListener, TemplateRef, ViewContainerRef } from '@angular/core';
import { sign_in } from '../model/sign-in.type';
import { sign_up } from '../model/sign-up.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    quickResponseForm: quick_contact = {};
    signinForm: sign_in = {
      rememberMe: false
    };
    signupForm: sign_up = {};

    forgetPasswordForm: any = {
      email : ""
    };

    constructor(private sharedService : SharedService) {
      
    }


    @ViewChild('signupPage') signupTemplate : ElementRef<any> | undefined;
    @ViewChild('loginPage') loginTemplate : ElementRef<any> | undefined;
    @ViewChild('faqPage') faqTemplate : ElementRef<any> | undefined;
    @ViewChild('chatbotPage') chatbotTemplate : ElementRef<any> | undefined;
    @ViewChild('forgetPasswordPage1') forgetPasswordTemplate : ElementRef<any> | undefined;
    @ViewChild('forgetPasswordPage2') forgetPasswordTemplate2 : ElementRef<any> | undefined;
    @ViewChild('forgetPasswordPage3') forgetPasswordTemplate3 : ElementRef<any> | undefined;


    reason:string = "";

    ngOnInit () : void {
      // Check for the JWT token in localStorage
      const storedToken = localStorage.getItem('jwt');
      
      if (storedToken) {
        console.log("JWT token found in localStorage. Logging in automatically...");
        
        // Optionally, validate the token with the server or just proceed with authorization
        this.authorization();
      } else {
        console.log("No JWT token found in localStorage.");
        const storedToken2 = sessionStorage.getItem('jwt');
        if (storedToken2) {
          console.log("JWT token found in sessionStorage. Logging in automatically...");
          
          // Optionally, validate the token with the server or just proceed with authorization
          this.authorization();
        }
      }
    }

    activePanel: string | null = null;

    togglePanel(panelId: string) {
      this.activePanel = this.activePanel === panelId ? null : panelId;
    }

    onClickSignup() {
      if (this.signupTemplate) {
        this.signupTemplate.nativeElement.style.display = "flex";
      }
    }

    onCloseSignup() {
      if (this.signupTemplate) {
        this.signupTemplate.nativeElement.style.display = "none";
      }
    }

    onClickLogin() {
      if (this.loginTemplate) {
        this.loginTemplate.nativeElement.style.display = "flex";
      }
    }

    onCloseLogin() {
      if (this.loginTemplate) {
        this.loginTemplate.nativeElement.style.display = "none";
      }
    }

    toggle_signin() {
      this.onCloseLogin();
      this.onClickSignup();
    }

    toggle_signup() {
      this.onCloseSignup();
      this.onClickLogin();
    }

    Name : string = "";
    Email : string = "";
    onSubmit() {
      if (!this.signinForm.email) {
        alert('Please enter your email.');
        return;
      }
      if (!this.validateEmail(this.signinForm.email)) {
        alert('Invalid email format.');
        return;
      }
      if (!this.signinForm.password) {
        alert('Please enter your password.');
        return;
      }
      if (this.signinForm.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
    
      // Perform authentication
      console.log('Logging in with:', this.signinForm);
      console.log(this.signinForm.rememberMe);
    
      this.sharedService.signin(this.signinForm).subscribe({
        next: (response) => {
          console.log("Full API Response:", response);
          
          this.Name = response.name;
          this.Email = response.email;
          const JwtToken = response.token;
          const expiresAt = response.expiresAt;
          
          console.log("Name: ", this.Name);
          console.log("Email: ", this.Email);
          

          if (JwtToken) {
            console.log("Extracted JWT Token:", JwtToken);
    
            if (this.signinForm.rememberMe) {
              localStorage.setItem('jwt', JwtToken);
              localStorage.setItem('jwt_expires', expiresAt.toString());
              console.log("JWT token stored in localStorage with expiration.");
              
            } else {
              // Store token and expiration in sessionStorage for session-based persistence
              sessionStorage.setItem('jwt', JwtToken);
              sessionStorage.setItem('jwt_expires', expiresAt.toString());
              console.log("JWT token stored in sessionStorage with expiration.");
            }
    
            this.authorization();
          } else {
            console.log("Error in login: No token received");
          }
        },
        error: (error) => {
          console.error("Login failed: ", error);
          alert("Login failed. Please check your credentials.");
        },
        complete: () => {
          console.log("Login request completed.");
        }
      });
    }
    

    authorization() {
      const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
      const expiresAt = parseInt(localStorage.getItem('jwt_expires') || sessionStorage.getItem('jwt_expires') || "0");
    
      if (!token || Date.now() > expiresAt) {
        console.log("Token expired or missing. Logging out...");
        alert("Session expired. Please log in again.");
        this.logout();
        return;
      }
    
      this.sharedService.authenticate().subscribe(
        (response) => {
          console.log(response);
          this.load_dashboard();
        }
      );
    }
    
    logout() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('jwt_expires');
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('jwt_expires');
      console.log("User logged out. JWT cleared.");
    }
    
    

    @ViewChild('dashboard') dashboardTemplate : TemplateRef<any> | undefined;
    @ViewChild('view', {read:ViewContainerRef}) viewTemplate : ViewContainerRef | undefined;

    flag: boolean = true;
    load_dashboard() {
      if (this.dashboardTemplate) {
        console.log("Trying to load dashboard");
        this.flag = false;
        this.onCloseLogin();
        this.viewTemplate?.createEmbeddedView(this.dashboardTemplate);
      }
    }


    validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    onSignupSubmit() {
      if (!this.signupForm.name) {
        alert('Please enter your name.');
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(this.signupForm.name)) {
        alert('Name should contain only letters.');
        return;
      }
      if (!this.signupForm.email) {
        alert('Please enter your email.');
        return;
      }
      if (!this.validateEmail(this.signupForm.email)) {
        alert('Invalid email format.');
        return;
      }
      if (!this.signupForm.password) {
        alert('Please enter a password.');
        return;
      }
      if (this.signupForm.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
      if (!this.signupForm.confirm_password) {
        alert('Please confirm your password.');
        return;
      }
      if (this.signupForm.password !== this.signupForm.confirm_password) {
        alert('Passwords do not match.');
        return;
      }
      if (!this.signupForm.termsAccepted) {
        alert('You must agree to the Terms & Policy.');
        return;
      }

      console.log('Signing up with:', this.signupForm);
      this.sharedService.register(this.signupForm).subscribe (
        (response) => {
          if (response != null) {
            console.log(response.message);
            this.onCloseSignup();
            this.onClickLogin();
          }
          else {
            console.log("Error in Register");
            alert("Error Occured in Signup");
          }
        }
      );
    }

    onQuickResponseSubmit() {
      if (!this.quickResponseForm.full_name) {
        alert('Please enter your full name.');
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(this.quickResponseForm.full_name)) {
        alert('Name should contain only letters.');
        return;
      }
      if (!this.quickResponseForm.email) {
        alert('Please enter your email.');
        return;
      }
      if (!this.validateEmail(this.quickResponseForm.email)) {
        alert('Invalid email format.');
        return;
      }
      if (this.quickResponseForm.phone && !/^\d{11,15}$/.test(this.quickResponseForm.phone)) {
        alert('Please enter a valid phone number (11-15 digits).');
        return;
      }
      if (!this.reason) {
        alert('Please select a reason for contacting.');
        return;
      }
      else {
        this.quickResponseForm.reason = this.reason;
      }
      if (!this.quickResponseForm.message) {
        alert('Please enter your message.');
        return;
      }

      // Simulate form submission (replace with API call)
      console.log('Form submitted:', this.quickResponseForm);
      alert('Your message has been sent successfully!');
      this.sharedService.quick_contact(this.quickResponseForm).subscribe (
        (response) => {
          if (response != null) {
            console.log(response.message);
          }
          else {
            console.log("Error in Quick Contact");
            alert("Error Occured in Quick Contact");
          }
        }
      );
    }


    // FAQ Section Logics
    openFAQ() {
        if (this.faqTemplate) {
          this.faqTemplate.nativeElement.style.display = "flex";
        }
    }

    onCloseFAQ() {
        if (this.faqTemplate) {
          this.faqTemplate.nativeElement.style.display = "none";
        }
    }

    // Chatbot Section Logics
    openchatbot() {
      if (this.chatbotTemplate) {
        this.chatbotTemplate.nativeElement.style.display = "flex";
      }
    }

    onClosechatbot() {
        if (this.chatbotTemplate) {
          this.chatbotTemplate.nativeElement.style.display = "none";
        }
    }

    @ViewChild('chatBox') chatBox!: ElementRef;
    
      questions: string[] = [
        "What are your working hours?",
        "How can I contact support?",
        "Do you offer refunds?",
        "What is the address?",
        "Contact Numbers?"
      ];
    
      answers: string[] = [
        "Our working hours are from 9:30 AM to 6:30 PM, Sunday to Thursday.",
        "You can contact our support via email at info@datasoft-bd.com or call us at +880-2-48115029, +880-2-58151542, +880-2-48121377.",
        "Yes, we offer refunds within 30 days of purchase. Please check our refund policy.",
        "Building: Rupayan Shelford (20th Floor) Area: Mirpur Road, Shyamoli  City: Dhaka  Country: Bangladesh",
        "call us at +880-2-48115029, +880-2-58151542, +880-2-48121377."
      ];
    
      chatMessages: { text: string, type: 'question' | 'response' }[] = [];
    
      private isAtBottom = true; // Track if user is at the bottom
    
      showAnswer(index: number) {
        this.chatMessages.push({ text: this.questions[index], type: 'question' });
        this.chatMessages.push({ text: this.answers[index], type: 'response' });
    
          this.scrollToBottom();
      }
    
      // Scroll to the bottom if the user is at the bottom before new message
      scrollToBottom() {
        setTimeout(() => {
          if (this.chatBox) {
            this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
          }
        }, 100);
      }
    
      // Detect user scroll
      @HostListener('scroll', ['$event'])
      onScroll(event: any) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        this.isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // User is at bottom
      }

      forgetPassword() {
        console.log("Inside forget Password");
        
        if (this.forgetPasswordTemplate) {
          this.onCloseLogin();
          this.forgetPasswordTemplate.nativeElement.style.display = "flex";
        }

      }
      
      storedMail: string = "";
      // onSentOTPSubmit() {
      //   console.log("Inside Sent OTP Submit");
        

      //   if (!this.forgetPasswordForm.email) {
      //     alert('Please enter your email.');
      //     return;
      //   }
      //   if (!this.validateEmail(this.forgetPasswordForm.email)) {
      //     alert('Invalid email format.');
      //     return;
      //   }
      //   else {
      //     // Send OTP Logic Goes Here
      //     console.log("Trying to verify email");
          
      //     this.sharedService.verifyMail(this.forgetPasswordForm.email).subscribe (
      //       (response) => {
      //         if (response.message == "OTP Sent in the Email successfully") {
      //           console.log("Email Verified. Response: ");
      //           console.log(response.message);
      //           this.forgetPassword();
      //           this.onCloseforgetPassword();
      //           this.storedMail = this.forgetPasswordForm.email;
      //           this.forgetPasswordForm.email = "";
      //           this.OnClickVeriftyOTP();
      //         }
      //         else {
      //           console.log("Error in Verify Mail");
      //           alert("Enter a Vaild Mail");
      //         }
      //       }
      //     );
      //   }
      // }

      onSentOTPSubmit() {
        console.log("Inside Sent OTP Submit");
        

        if (!this.forgetPasswordForm.email) {
          alert('Please enter your email.');
          return;
        }
        if (!this.validateEmail(this.forgetPasswordForm.email)) {
          alert('Invalid email format.');
          return;
        }

        this.sharedService.verifyMail(this.forgetPasswordForm.email).subscribe({
          next: (response) => {
            if (response.message) {
              console.log('Email Verified. Response:', response.message);
              this.storedMail = this.forgetPasswordForm.email;
              this.forgetPasswordForm.email = '';
              this.OnClickVeriftyOTP();
              this.onCloseforgetPassword();
            }
          },
          error: (err) => {
            console.error('Error in Verify Mail:', err.message);
            alert(err.message);
          }
        });
        
      }
      

      onCloseforgetPassword() {
        if (this.forgetPasswordTemplate) {
          this.forgetPasswordTemplate.nativeElement.style.display = "none";
        }
      }

      toggle_forgetPassword() {
        this.onCloseforgetPassword();
        this.onClickLogin();
      }

      OnClickVeriftyOTP() {
        if (this.forgetPasswordTemplate2) {
          this.forgetPasswordTemplate2.nativeElement.style.display = "flex";
        }
      }

      onCloseVerifyOTP() {
        if (this.forgetPasswordTemplate2) {
          this.forgetPasswordTemplate2.nativeElement.style.display = "none";
        }
      }

      toggle_verify_otp() {
        this.onCloseVerifyOTP();
        this.forgetPassword();
      }

      onVerifySubmit() {
        if (!this.forgetPasswordForm.otp) {
          alert('Please enter the OTP.');
          return;
        }
        if (this.forgetPasswordForm.otp.length < 6) {
          alert('OTP must be 6 characters long.');
          return;
        }
        else {
          // OTP Verification Logic Goes Here
          this.sharedService.verifyOtp(this.forgetPasswordForm.otp, this.storedMail).subscribe({
            next: (response) => {
              console.log('OTP Verified:', response.message);
              this.forgetPasswordForm.otp = "";
                this.OnClickResetPassword();
                this.onCloseVerifyOTP();
            },
            error: (err) => {
              console.error('Error in OTP verification:', err.message);
              alert(err.message);  

              if (err.message == "OTP expired. Please request a new one.") {
                this.forgetPasswordForm.otp = "";
                this.onCloseVerifyOTP();
                this.forgetPassword();
                console.log("OTP Expired. Opening Forget Password Page");
              }
            }
          });
          
        }
      }

      OnClickResetPassword() {
        if (this.forgetPasswordTemplate3) {
          this.forgetPasswordTemplate3.nativeElement.style.display = "flex";
        }
      }

      onCloseResetPassword() {
        if (this.forgetPasswordTemplate3) {
          this.forgetPasswordTemplate3.nativeElement.style.display = "none";
        }
      }

      onResetPassword () {
        console.log("Inside Reset Password");
        
        if (!this.forgetPasswordForm.new_password) {
          alert('Please enter a new password.');
          return;
        }
        if (this.forgetPasswordForm.new_password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
        }
        if (!this.forgetPasswordForm.confirm_password) {
          alert('Please confirm your password.');
          return;
        }
        if (this.forgetPasswordForm.new_password !== this.forgetPasswordForm.confirm_password) {
          alert('Passwords do not match.');
          return;
        }
        else {
          // Reset Password Logic Goes Here
          console.log("Trying to reset password");
          
          this.sharedService.resetPassword(this.forgetPasswordForm.new_password, this.forgetPasswordForm.confirm_password, this.storedMail).subscribe (
            (response) => {
              if (response != null) {
                console.log(response.message);
                this.forgetPasswordForm.new_password = "";
                this.forgetPasswordForm.confirm_password = "";
                this.onCloseResetPassword();
                this.onClickLogin();
              }
              else {
                console.log("Error in Reset Password");
                alert("Error Occured in Reset Password");
              }
            }
          );
      }
    }
}
