import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import { CartProvider } from '@/context/cart-context';
import { CategoryProvider } from '@/context/category-context';
import { CustomerPetProvider } from '@/context/customer-pet-context';
import { ProductProvider } from '@/context/product-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ProductProvider>
        <CategoryProvider>
          <CustomerPetProvider>
            <CartProvider>
              <AnimatedSplashOverlay />
              <AppTabs />
            </CartProvider>
          </CustomerPetProvider>
        </CategoryProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}
