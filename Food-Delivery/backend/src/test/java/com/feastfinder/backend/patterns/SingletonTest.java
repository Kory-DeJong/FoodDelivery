package com.feastfinder.backend.patterns;

import com.feastfinder.common.config.AppConfig;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SingletonTest {
    @Test
    void appConfig_isSingleton() {
        AppConfig a = AppConfig.getInstance();
        AppConfig b = AppConfig.getInstance();
        assertThat(a).isSameAs(b);
    }
}

