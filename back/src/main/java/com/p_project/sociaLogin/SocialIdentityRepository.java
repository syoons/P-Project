package com.p_project.sociaLogin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialIdentityRepository extends JpaRepository<SocialIdentityEntity, Long> {

    Optional<SocialIdentityEntity> findByProviderAndProviderId(Provider provider, String providerId);

}