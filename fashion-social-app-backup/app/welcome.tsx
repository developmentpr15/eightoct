import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>👗</Text>
          <Text style={styles.title}>Fashion Social</Text>
        </View>
        
        <Text style={styles.subtitle}>
          Share your style, discover trends, compete with fashion lovers worldwide
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📸</Text>
            <Text style={styles.featureText}>Share Outfits</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👔</Text>
            <Text style={styles.featureText}>Digital Wardrobe</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Style Competitions</Text>
          </View>
        </View>
        
        <View style={styles.buttons}>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  terms: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    opacity: 0.7,
  },
});