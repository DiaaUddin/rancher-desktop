.PHONY: all
all:
	bats --show-output-of-passing-tests ./tests/*/

.PHONY: containers
containers:
	bats --show-output-of-passing-tests ./tests/containers/

# https://www.shellcheck.net/wiki/SC1091 -- Not following: xxx was not specified as input (see shellcheck -x)
# https://www.shellcheck.net/wiki/SC2034 -- xxx appears unused. Verify use (or export if used externally)
# https://www.shellcheck.net/wiki/SC2154 -- xxx is referenced but not assigned
# https://www.shellcheck.net/wiki/SC2155 -- Declare and assign separately to avoid masking return values

SC_EXCLUDES ?= SC1091,SC2034,SC2154,SC2155

.PHONY: lint
lint:
	@./scripts/bats-lint.pl $(shell find tests -name '*.bats')
	find tests -name '*.bash' | xargs shellcheck -s bash -e $(SC_EXCLUDES)
	find tests -name '*.bats' | xargs shellcheck -s bash -e $(SC_EXCLUDES)
	find tests -name '*.bash' | xargs shfmt -s -d
	find tests -name '*.bats' | xargs shfmt -s -d

DEPS = bin/darwin/jq bin/linux/jq

# Package bats tests with bats itself and dependencies into a single tarball for distribution
bats.tar.gz: $(DEPS)
	git submodule update --init --recursive
	tar cvfz "$@" --exclude-vcs --exclude "*/test/*" --exclude "*/docs/*" -- *

JQ_VERSION ?= 1.6
JQ_URL=https://github.com/stedolan/jq/releases/download/jq-$(JQ_VERSION)

bin/darwin/jq:
	mkdir -p bin/darwin
	wget --no-verbose $(JQ_URL)/jq-osx-amd64 -O $@
	chmod +x $@

bin/linux/jq:
	mkdir -p bin/linux
	wget --no-verbose $(JQ_URL)/jq-linux64 -O $@
	chmod +x $@

.PHONY: clean
clean:
	rm -f $(DEPS)
	rm -f bats.tar.gz
