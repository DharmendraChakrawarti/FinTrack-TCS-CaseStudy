package practice.dc.financetracker.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import practice.dc.financetracker.dto.AuthResponse;
import practice.dc.financetracker.dto.LoginRequest;
import practice.dc.financetracker.dto.SignupRequest;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.repository.UserRepository;
import practice.dc.financetracker.security.JwtTokenProvider;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateTokenFromUsername(user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = (User) authentication.getPrincipal();

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }
}
