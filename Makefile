ADDON_NAME=loginstorage
ADDON_VERSION=0.1

.PHONY: clean
clean:
	git clean -fX .

.PHONY: package
package: clean
	rm -f $(ADDON_NAME)-$(ADDON_VERSION).xpi
	cd src && zip -r ../$(ADDON_NAME)-$(ADDON_VERSION).xpi *
