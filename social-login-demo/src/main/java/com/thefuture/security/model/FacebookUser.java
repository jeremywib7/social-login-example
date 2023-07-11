package com.thefuture.security.model;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacebookUser {
    private String id;
    private String name;
    private String email;
    private Picture picture;

    @Getter
    @Setter
    public static class Picture {
        private PictureData data;

        @Getter
        @Setter
        public static class PictureData {
            private int height;
            private boolean is_silhouette;
            private String url;
            private int width;
        }
    }
}
