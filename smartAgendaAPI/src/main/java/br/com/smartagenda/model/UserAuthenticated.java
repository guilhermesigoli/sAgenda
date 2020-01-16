package br.com.smartagenda.model;

public class UserAuthenticated {
    private String username;
    private String token;
    private long duration_token;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getDuration_token() {
        return duration_token;
    }

    public void setDuration_token(long duration_token) {
        this.duration_token = duration_token;
    }

    @Override
    public String toString() {
        return "{" +
                "\"username\":" + "\"" + username + "\"" +
                ", \"token\":" + "\"" + token + "\"" +
                ", \"duration_token\":" + duration_token +
                "}";
    }
}
