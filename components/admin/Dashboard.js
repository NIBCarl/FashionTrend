import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import AdminNavbar from './AdminNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
const screenWidth = Dimensions.get('window').width;

const Dashboard = ({ navigation }) => {
  return (
    <SafeAreaView>
      <AdminNavbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <SummaryCard
            title="New Orders"
            value="123456"
            color="#007bff"
            icon={<MaterialCommunityIcons name="cart-outline" size={28} color="white" />}
          />
          <SummaryCard
            title="Total Income"
            value="Php 123456"
            color="#ff1e1e"
            icon={<FontAwesome name="dollar" size={28} color="white" />}
          />
        </View>
        <View style={styles.cardsRow}>
          <SummaryCard
            title="Total Expense"
            value="123456"
            color="#ff9900"
            icon={<MaterialCommunityIcons name="wallet-outline" size={28} color="white" />}
          />
          <SummaryCard
            title="New Users"
            value="123456"
            color="#28a745"
            icon={<Ionicons name="person-circle-outline" size={28} color="white" />}
          />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          
          <Text style={styles.chartTitle}>Total Sales Per Month</Text>
          <BarChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug'],
              datasets: [
                {
                  data: [130, 90, 140, 180, 60, 110, 150, 200],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              fillShadowGradient: '#ff7a00',
              fillShadowGradientOpacity: 1,
              decimalPlaces: 0,
              color: () => '#007bff',
              labelColor: () => '#333',
              style: {
                borderRadius: 10,
              },
              propsForBackgroundLines: {
                stroke: '#eee',
              },
              propsForLabels: {
                fontSize: 12,
              },
            }}
            style={{
              borderRadius: 10,
              marginVertical: 8,
            }}
          />
        </View>
        <View style={styles.ordersChartContainer}>
          <Text style={styles.chartTitle}>Total Number of Orders</Text>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept"],
              datasets: [
                {
                  data: [250, 380, 170, 260, 140, 520, 360, 440, 180],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            withDots={false}
            withInnerLines
            withOuterLines
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: "#ff6f61",
              backgroundGradientTo: "#ff6f61",
              color: () => "#000", // line color
              labelColor: () => "#000",
              strokeWidth: 2,
              propsForBackgroundLines: {
                stroke: "#000",
                strokeWidth: 1,
              },
            }}
            style={styles.ordersChart}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const SummaryCard = ({ title, value, color, icon }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <View style={styles.cardContent}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <View style={styles.cardIcon}>{icon}</View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingBottom: 50,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    padding: 16,
    margin: 5,
    borderRadius: 10,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardIcon: {
    marginLeft: 10,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
   
  },
  chartTitle: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  ordersChartContainer: {
    marginTop: 30,
    backgroundColor: '#ff6f61',
    borderRadius: 16,
    padding: 10,
    paddingBottom: 20,
    marginBottom: 30,
  },
  ordersChart: {
    borderRadius: 16,
  },
});

export default Dashboard;
