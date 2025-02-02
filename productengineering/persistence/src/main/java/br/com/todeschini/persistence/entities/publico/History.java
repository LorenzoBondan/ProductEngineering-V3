package br.com.todeschini.persistence.entities.publico;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Builder
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "t_history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime tstamp;
    private String schemaname;
    private String tabname;
    private String operation;
    @Type(type = "jsonb") // ON TEST PROFILE, CHANGE TO json TO AVOID LOG ERROR WHEN APPLICATION STARTS
    @Column(unique = true, columnDefinition = "jsonb")
    private Map<String, Object> oldVal;
}
