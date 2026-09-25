FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace/app

COPY gradlew build.gradle ./
COPY gradle/wrapper ./gradle/wrapper

# Dependencies get their own layer, so source changes reuse the download
RUN ./gradlew dependencies --no-daemon

COPY src src

# Linting and tests run in CI and compose.test.yaml
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

# wget is used by the Compose health check
RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=build --chown=appuser:appgroup /workspace/app/build/libs/urban-housing-demand-1.0.jar app.jar
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
