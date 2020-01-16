package br.com.smartagenda.repository;

import br.com.smartagenda.model.Event;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface EventRepository extends CrudRepository<Event, Long> {

}
