#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <Wire.h>
#include <MPU6050_light.h>
#include <Adafruit_BMP280.h>  // BMP280 library

// Pin Definitions
#define DHTPIN 18
#define DHTTYPE DHT22        // Changed from DHT11 to DHT22
#define RXPin 16             // GPS TX -> ESP32 RX
#define TXPin 17             // GPS RX -> ESP32 TX

// Sensor setup
DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);
MPU6050 mpu(Wire);
Adafruit_BMP280 bmp;  // BMP280 instance

// Wi-Fi Credentials
const char* ssid = "motorola";
const char* password = "9606256753";

// ThingSpeak
const char* thingSpeakServer = "http://api.thingspeak.com";
const char* apiKey = "PXRA7XF84XFW5DNV";

// Sensor variables
float temperature = 0.0, humidity = 0.0;
float pressure = 0.0, altitude = 0.0;
float accelX = 0.0, gyroX = 0.0;
double latitude = 0.0, longitude = 0.0;

const uint32_t REPORTING_PERIOD_MS = 1000;
const uint32_t THINGSPEAK_PERIOD_MS = 20000;
uint32_t lastReportTime = 0;
uint32_t lastThingSpeakTime = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting...");

  // GPS
  SerialGPS.begin(9600, SERIAL_8N1, RXPin, TXPin);

  // Wi-Fi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize sensors
  dht.begin();

  Wire.begin();

  if (!bmp.begin(0x76)) {  // Default I2C address for many BMP280 modules
    Serial.println("Could not find BMP280 sensor! Check wiring.");
    while (1);
  }

  byte status = mpu.begin();
  if (status != 0) {
    Serial.print("MPU6050 init failed with code: ");
    Serial.println(status);
    while (1);
  }
  mpu.calcGyroOffsets();
}

void loop() {
  // DHT22
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // BMP280
  pressure = bmp.readPressure() / 100.0F;       // Convert Pa to hPa
  altitude = bmp.readAltitude(670.25);         // Replace with local sea level pressure if needed

  // GPS
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }
  if (gps.location.isValid()) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
  }

  // MPU6050
  mpu.update();
  accelX = mpu.getAccX();
  gyroX = mpu.getGyroX();

  // Print to Serial
  if (millis() - lastReportTime > REPORTING_PERIOD_MS) {
    Serial.print("Temp: "); Serial.println(temperature);
    Serial.print("Humidity: "); Serial.println(humidity);
    Serial.print("Pressure: "); Serial.println(pressure);
    Serial.print("Altitude: "); Serial.println(altitude);
    Serial.print("AccelX: "); Serial.println(accelX);
    Serial.print("GyroX: "); Serial.println(gyroX);
    Serial.print("Latitude: "); Serial.println(latitude, 6);
    Serial.print("Longitude: "); Serial.println(longitude, 6);
    Serial.println("*");
    lastReportTime = millis();
  }

  // ThingSpeak
  if (millis() - lastThingSpeakTime > THINGSPEAK_PERIOD_MS) {
    sendToThingSpeak();
    lastThingSpeakTime = millis();
  }
}

void sendToThingSpeak() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = String(thingSpeakServer) + "/update?api_key=" + apiKey +
                 "&field1=" + String(temperature) +
                 "&field2=" + String(humidity) +
                 "&field3=" + String(pressure, 2) +
                 "&field4=" + String(altitude, 2) +
                 "&field5=" + String(accelX, 3) +
                 "&field6=" + String(gyroX, 3) +
                 "&field7=" + String(latitude, 6) +
                 "&field8=" + String(longitude, 6);

    http.begin(url);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      Serial.print("ThingSpeak Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending to ThingSpeak: ");
      Serial.println(http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected. Unable to send to ThingSpeak.");
  }
}
