#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at usr/src/OPENSOLARIS.LICENSE
# or http://www.opensolaris.org/os/licensing.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at usr/src/OPENSOLARIS.LICENSE.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

# parfait is a bit unhappy (24796395)
export PARFAIT_BUILD=no

BUILD_BITS=		64_and_32
# Upstream requires gcc flags that Studio doesn't support
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		flac
COMPONENT_VERSION=	1.3.3
COMPONENT_PROJECT_URL=	https://xiph.org/flac/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
       sha256:213e82bd716c9de6db2f98bcadbc4c24c7e2efe8c75939a1a84e28539c4e1748
COMPONENT_ARCHIVE_URL=	http://downloads.xiph.org/releases/flac/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	817

COMPONENT_BAID=		71520

# tests work but take hours to run and use a lot of disk space
TEST_TARGET = $(SKIP_TEST)

# The doxygen configuration expects to be built in the source directory
COMPONENT_POST_CONFIGURE_ACTION += ( \
       perl -pi -e 's!^(STRIP_FROM_PATH.*=).*!$$1 $(SOURCE_DIR)!' "$(SOURCE_DIR)/doc/Doxyfile.in"; \
);



include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --enable-ogg

REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += codec/libvorbis
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
